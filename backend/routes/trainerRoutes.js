const express = require('express');
const bcrypt = require('bcryptjs');
const Trainer = require('../models/Trainer');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dohvati sve trenere
router.get('/', async (req, res) => {
  try {
    const {search, sortByRating, page = 1, limit = 10} = req.query;

    let query = {};

    // Filtriraj po imenu ili tituli
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: 'i'}},
        {title: {$regex: search, $options: 'i'}},
      ];
    }

    // Sortiraj po oceni (ako je zahtevano)
    const sortOption = sortByRating ? {rating: -1} : {};

    // Paginacija
    const trainers = await Trainer.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(trainers);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// Dodaj trenera
router.post('/register', async (req, res) => {
  console.log('REQ.BODY:', req.body);
  try {
    const {
      name,
      email,
      password,
      title,
      description,
      profileImage,
      introVideo,
      certificates,
      role,
    } = req.body;

    // Provera da li trener već postoji
    let trainer = await Trainer.findOne({email});
    if (trainer) {
      return res.status(400).json({msg: 'Trener sa ovim emailom već postoji'});
    }

    // Hashovanje lozinke
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kreiranje novog trenera
    trainer = new Trainer({
      name,
      email,
      password: hashedPassword,
      title,
      description,
      profileImage,
      introVideo,
      role,
      certificates: certificates || [],
      rating: 0,
      reviews: [],
      trainingPackages: [],
    });

    // ✅ Generiši token nakon registracije
    const token = jwt.sign(
      {id: trainer._id, role: 'trainer'},
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    await trainer.save();
    res.status(201).json({msg: 'Trener uspešno registrovan', token, trainer});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// 📌 Dohvati treninge ili planove ishrane trenera
router.get('/:trainerId/:contentType', async (req, res) => {
  try {
    const {trainerId, contentType} = req.params;
    console.log(`🔍 Zahtev za ${contentType} od trenera ID: ${trainerId}`);
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      console.log('❌ Trener nije pronađen');
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    if (contentType === 'trainings') {
      return res.json(trainer.trainingPackages || []);
    } else if (contentType === 'plans') {
      return res.json(trainer.mealPlans || []);
    } else {
      console.log('❌ Nepoznata kategorija:', contentType);
      return res.status(400).json({msg: 'Nepoznata kategorija'});
    }
  } catch (err) {
    console.error('❌ Greška na serveru:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// ✅ Dodavanje trening paketa sa više videa i opisima
router.post('/:trainerId/training-packages', async (req, res) => {
  try {
    const {title, description, coverImage, introVideo, price, videos} =
      req.body;
    const trainer = await Trainer.findById(req.params.trainerId);

    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    // 📌 Provera da li su svi neophodni podaci poslati
    if (
      !title ||
      !description ||
      !coverImage ||
      !introVideo ||
      !price ||
      !videos ||
      videos.length === 0
    ) {
      return res
        .status(400)
        .json({msg: 'Svi podaci su obavezni, uključujući barem jedan video'});
    }

    // 📌 Provera da li svaki video ima title i videoUrl
    const validatedVideos = videos.map(video => ({
      title: video.title || 'Untitled Video',
      videoUrl: video.videoUrl || '',
    }));

    if (validatedVideos.some(video => !video.videoUrl)) {
      return res.status(400).json({msg: 'Svaki video mora imati URL'});
    }

    const newPackage = {
      title,
      description,
      price,
      coverImage, // ✅ Cover slika
      introVideo, // ✅ Intro video
      videos: validatedVideos, // 📌 Čistimo podatke i obezbeđujemo da nisu prazni
      createdAt: new Date(),
    };

    trainer.trainingPackages.push(newPackage);
    await trainer.save();

    res.status(201).json(newPackage);
  } catch (err) {
    console.error('❌ Greška pri dodavanju trening paketa:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// ✅ Dodavanje plana ishrane
router.post('/:trainerId/meal-plans', async (req, res) => {
  try {
    const {title, description, price, coverImage, introVideo} = req.body;
    const trainer = await Trainer.findById(req.params.trainerId);

    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    const newPlan = {
      title,
      description,
      price,
      coverImage, // ✅ Cover slika
      introVideo, // ✅ Intro video
      createdAt: new Date(),
    };

    trainer.mealPlans.push(newPlan);
    await trainer.save();

    res.status(201).json(newPlan); // ✅ Vraćamo samo novi plan, ne celu listu
  } catch (err) {
    console.error('❌ Greška pri dodavanju plana ishrane:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

router.post('/purchase/:trainerId', async (req, res) => {
  try {
    const {trainerId} = req.params;
    const {amount} = req.body; // Cena trening paketa

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    // 📌 Dodajemo zaradu u wallet
    trainer.wallet.totalEarnings += amount;
    trainer.wallet.availableForPayout += amount;

    await trainer.save();

    res.json({msg: 'Kupovina uspešno evidentirana', wallet: trainer.wallet});
  } catch (err) {
    console.error('❌ Greška pri ažuriranju zarade:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

router.post('/request-payout/:trainerId', async (req, res) => {
  try {
    const {trainerId} = req.params;

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    if (trainer.wallet.availableForPayout <= 0) {
      return res.status(400).json({msg: 'Nema dostupnog novca za isplatu'});
    }

    // 📌 Simulacija isplate (u produkciji ovo ide preko Stripe-a)
    const payoutAmount = trainer.wallet.availableForPayout;
    trainer.wallet.availableForPayout = 0; // Resetujemo dostupan novac

    await trainer.save();

    res.json({msg: 'Isplata zatražena', payoutAmount});
  } catch (err) {
    console.error('❌ Greška pri slanju zahteva za isplatu:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// 📌 Dohvati feed – svi treninzi i planovi ishrane od svih trenera
router.get('/feed', async (req, res) => {
  try {
    const trainers = await Trainer.find();

    const allItems = [];

    trainers.forEach(trainer => {
      // Dodaj sve trening pakete
      trainer.trainingPackages.forEach(pkg => {
        allItems.push({
          ...pkg.toObject(),
          type: 'training',
          trainerId: trainer._id,
          trainerName: trainer.name,
          trainerImage: trainer.profileImage,
          createdAt: pkg.createdAt,
        });
      });

      // Dodaj sve planove ishrane
      trainer.mealPlans.forEach(plan => {
        allItems.push({
          ...plan.toObject(),
          type: 'meal',
          trainerId: trainer._id,
          trainerName: trainer.name,
          trainerImage: trainer.profileImage,
          createdAt: plan.createdAt,
        });
      });
    });

    // Sortiraj po datumu (najnovije prvo)
    const sortedFeed = allItems.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json(sortedFeed);
  } catch (err) {
    console.error('❌ Greška pri dohvatanju feed-a:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// ✅ Dohvati jednog trenera po ID-ju
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    res.json(trainer);
  } catch (err) {
    console.error('❌ Greška pri dohvatanju trenera:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

module.exports = router;

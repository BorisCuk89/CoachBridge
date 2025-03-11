const express = require('express');
const bcrypt = require('bcryptjs');
const Trainer = require('../models/Trainer');
const router = express.Router();

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
  try {
    const {
      name,
      email,
      password,
      title,
      description,
      profileImage,
      certificates,
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
      certificates: certificates || [],
      rating: 0,
      reviews: [],
      trainingPackages: [],
    });

    await trainer.save();
    res.status(201).json({msg: 'Trener uspešno registrovan', trainer});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// 🔹 Dohvati sve pakete za određenog trenera
router.get('/trainers/:trainerId/packages', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }
    res.json(trainer.trainingPackages);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// 🔹 Dodaj novi paket treninga
router.post('/trainers/:trainerId/packages', async (req, res) => {
  try {
    const {title, description, price, videos} = req.body;
    const trainer = await Trainer.findById(req.params.trainerId);

    if (!trainer) {
      return res.status(404).json({msg: 'Trener nije pronađen'});
    }

    const newPackage = {
      title,
      description,
      price,
      videos: videos || [],
    };

    trainer.trainingPackages.push(newPackage);
    await trainer.save();

    res.status(201).json(trainer.trainingPackages);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

module.exports = router;

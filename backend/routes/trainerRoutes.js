const express = require('express');
const bcrypt = require('bcryptjs');
const Trainer = require('../models/Trainer');
const router = express.Router();

// Dohvati sve trenere
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({rating: -1}); // Sortiraj po oceni
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
      rating: 0, // Default vrednost
      reviews: [],
      trainingPackages: [], // Trener će kasnije dodati pakete
    });

    await trainer.save();
    res.status(201).json({msg: 'Trener uspešno registrovan', trainer});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

module.exports = router;

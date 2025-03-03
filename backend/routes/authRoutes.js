const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 🔹 API: Registracija korisnika
router.post('/register', async (req, res) => {
  try {
    const {name, email, password} = req.body;

    console.log('📩 Email:', email);
    console.log('🔑 Uneti password:', password);

    if (!password) {
      console.log('❌ Nema lozinke u requestu!');
      return res.status(400).json({msg: 'Lozinka je obavezna'});
    }

    let user = await User.findOne({email});
    if (user) {
      console.log('❌ Korisnik već postoji');
      return res.status(400).json({msg: 'Korisnik već postoji'});
    }

    const salt = await bcrypt.genSalt(10);
    console.log('🧂 Salt generisan');

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('🔒 Hashovana lozinka:', hashedPassword);

    user = new User({name, email, password: hashedPassword});
    await user.save();

    res.status(201).json({msg: 'Registracija uspešna'});
  } catch (err) {
    console.error('❌ Greška u registraciji:', err);
    res.status(500).json({msg: 'Server error'});
  }
});

// 🔹 API: Login korisnika
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    // Provera da li korisnik postoji
    let user = await User.findOne({email});
    if (!user)
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});

    // Provera lozinke
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});

    // Kreiranje i slanje JWT tokena
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({token, user: {id: user._id, name: user.name, email: user.email}});
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// 🔹 API: Dohvati korisničke podatke (zaštićena ruta)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// 🔹 Middleware za proveru JWT tokena
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({msg: 'Nema tokena, pristup odbijen'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Neispravan token'});
  }
}

module.exports = router;

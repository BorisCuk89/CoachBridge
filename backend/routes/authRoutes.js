const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 📌 Middleware za proveru JWT tokena
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).json({msg: 'Nema tokena, pristup odbijen'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Neispravan ili istekao token'});
  }
};

// 📌 Registracija korisnika (klijent ili trener)
router.post('/register', async (req, res) => {
  try {
    const {name, email, password, role, description} = req.body;
    console.log('📩 Email:', email);
    console.log('🔑 Uneti password:', password);
    console.log('👤 Tip korisnika:', role);

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
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('🔒 Hashovana lozinka:', hashedPassword);

    // Kreiranje korisnika
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'client', // Podrazumevano role je 'client'
      description: role === 'trainer' ? description || '' : undefined,
    });

    await user.save();
    res.status(201).json({msg: 'Registracija uspešna'});
  } catch (err) {
    console.error('❌ Greška u registraciji:', err);
    res.status(500).json({msg: 'Server error'});
  }
});

// 📌 Login korisnika
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if (!user)
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});

    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        description: user.description,
      },
    });
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// 📌 Dohvati podatke o ulogovanom korisniku
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
});

// 📌 Logout (Frontend briše token)
router.post('/logout', (req, res) => {
  res.json({msg: 'Uspešno ste se odjavili'});
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const router = express.Router();
const nodemailer = require('nodemailer');

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

    // ✅ Generiši token nakon registracije
    const token = jwt.sign(
      {id: user._id, role: 'client'},
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    await user.save();
    res.status(201).json({msg: 'Registracija uspešna', token, user});
  } catch (err) {
    console.error('❌ Greška u registraciji:', err);
    res.status(500).json({msg: 'Server error'});
  }
});

// 📌 Login korisnika (klijent ili trener)
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    // 🔍 Prvo tražimo korisnika među klijentima
    let user = await User.findOne({email});

    // 🔍 Ako ga nema u klijentima, tražimo ga među trenerima
    let trainer = null;
    if (!user) {
      trainer = await Trainer.findOne({email});
    }

    // Ako ni ovde ne postoji, vraćamo grešku
    if (!user && !trainer) {
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});
    }

    const account = user || trainer; // Uzimamo pronađeni nalog

    // 🔐 Provera lozinke
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({msg: 'Neispravan email ili lozinka'});
    }

    // 🎟️ Generišemo JWT token
    const token = jwt.sign(
      {id: account._id, role: user ? 'client' : 'trainer'},
      process.env.JWT_SECRET,
      {expiresIn: '7d'},
    );

    // 📌 Vraćamo korisnika ili trenera u zavisnosti od toga ko se prijavio
    if (user) {
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'client',
        },
      });
    } else {
      res.json({
        token,
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          title: trainer.title,
          description: trainer.description,
          profileImage: trainer.profileImage || '',
          rating: trainer.rating || 0,
          certificates: trainer.certificates || [],
          trainingPackages: trainer.trainingPackages || [],
          role: 'trainer',
        },
      });
    }
  } catch (err) {
    console.error('❌ Greška prilikom logovanja:', err);
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

// 📌 Promena lozinke
router.put('/change-password', verifyToken, async (req, res) => {
  const {currentPassword, newPassword} = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({msg: 'Sva polja su obavezna'});
  }

  try {
    let account;

    if (req.user.role === 'client') {
      account = await User.findById(req.user.id);
    } else if (req.user.role === 'trainer') {
      account = await Trainer.findById(req.user.id);
    }

    if (!account) {
      return res.status(404).json({msg: 'Korisnik nije pronađen'});
    }

    // Proveri trenutnu lozinku
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({msg: 'Trenutna lozinka nije ispravna'});
    }

    // Hesiraj novu lozinku
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    account.password = hashedNewPassword;
    await account.save();

    res.json({msg: 'Lozinka je uspešno promenjena'});
  } catch (err) {
    console.error('❌ Greška pri promeni lozinke:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// 📌 Brisanje naloga (klijent ili trener)
router.delete('/delete-account', verifyToken, async (req, res) => {
  try {
    if (req.user.role === 'client') {
      await User.findByIdAndDelete(req.user.id);
    } else if (req.user.role === 'trainer') {
      await Trainer.findByIdAndDelete(req.user.id);
    } else {
      return res.status(400).json({msg: 'Nepoznata rola korisnika'});
    }

    res.json({msg: 'Nalog je uspešno obrisan'});
  } catch (err) {
    console.error('❌ Greška prilikom brisanja naloga:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

router.post('/forgot-password', async (req, res) => {
  const {email} = req.body;

  if (!email) return res.status(400).json({msg: 'Email je obavezan'});

  try {
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({msg: 'Korisnik nije pronađen'});

    // Generiši token za reset
    const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `coachbridge://reset-password?token=${resetToken}`;

    // Slanje emaila
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // npr. no-reply@gmail.com
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"CoachBridge" <no-reply@coachbridge.com>',
      to: user.email,
      subject: 'Reset lozinke',
      html: `<p>Kliknite na link za reset lozinke:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({msg: 'Link za reset lozinke je poslat na email'});
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

module.exports = router;

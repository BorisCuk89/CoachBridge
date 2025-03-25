const express = require('express');
const Stripe = require('stripe');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Kreiranje Stripe Checkout sesije
router.post('/create-checkout-session', async (req, res) => {
  try {
    const {userId, packageId} = req.body;

    console.log('🔍 Backend: Primljen userId:', userId);
    console.log('🔍 Backend: Primljen packageId:', packageId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Backend: Korisnik nije pronađen u bazi!');
      return res.status(404).json({msg: 'Korisnik nije pronađen'});
    }

    const trainingPackage = await Trainer.findOne({
      'trainingPackages._id': packageId,
    });

    if (!trainingPackage)
      return res.status(404).json({msg: 'Trening paket nije pronađen'});

    const packageDetails = trainingPackage.trainingPackages.find(
      p => p._id.toString() === packageId,
    );

    if (!packageDetails) return res.status(404).json({msg: 'Neispravan paket'});

    // ✅ Kreiraj Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: packageDetails.title,
              description: packageDetails.description,
              images: [packageDetails.coverImage],
            },
            unit_amount: packageDetails.price * 100, // 📌 Stripe prima cenu u centima
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5001/api/payments/success?userId=${userId}&packageId=${packageId}`,
      cancel_url: `http://localhost:5001/api/payments/cancel`,
    });

    res.json({url: session.url});
  } catch (err) {
    console.error('❌ Greška pri kreiranju sesije:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

// ✅ Ruta za uspešno plaćanje
router.get('/success', (req, res) => {
  const {userId, packageId} = req.query;

  if (!userId || !packageId) {
    return res.status(400).json({msg: 'Nedostaju userId ili packageId'});
  }

  console.log(`✅ Uspelo plaćanje za korisnika ${userId}, paket ${packageId}`);

  // 🚀 Preusmeri korisnika nazad u aplikaciju pomoću deep linka
  res.redirect(
    `coachbridge://payment-status?status=success&userId=${userId}&packageId=${packageId}`,
  );
});

// ❌ Ruta za otkazano plaćanje
router.get('/cancel', (req, res) => {
  console.log(`❌ Plaćanje otkazano`);

  // 🚀 Preusmeri korisnika nazad u aplikaciju pomoću deep linka
  res.redirect(`coachbridge://payment-status?status=failed`);
});

// ✅ Obradi uspešnu kupovinu --- proveriti da li se koristi
router.post('/payment-success', async (req, res) => {
  try {
    const {userId, packageId} = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({msg: 'Korisnik nije pronađen'});

    const trainer = await Trainer.findOne({'trainingPackages._id': packageId});

    if (!trainer) return res.status(404).json({msg: 'Trener nije pronađen'});

    // 📌 Dodaj paket u kupljene pakete korisnika
    user.purchasedPackages.push(packageId);
    await user.save();

    // 📌 Dodaj zaradu treneru
    const packageDetails = trainer.trainingPackages.find(
      p => p._id.toString() === packageId,
    );
    trainer.wallet.totalEarnings += packageDetails.price;
    trainer.wallet.availableForPayout += packageDetails.price;
    await trainer.save();

    res.json({msg: 'Kupovina uspešno završena'});
  } catch (err) {
    console.error('❌ Greška pri potvrdi plaćanja:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

module.exports = router;

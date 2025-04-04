const express = require('express');
const Stripe = require('stripe');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Kreiranje Stripe Checkout sesije
router.post('/create-checkout-session', async (req, res) => {
  try {
    const {userId, itemId, type} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({msg: 'Korisnik nije pronađen'});
    }

    let trainer, item;

    if (type === 'package') {
      trainer = await Trainer.findOne({'trainingPackages._id': itemId});
      if (!trainer) return res.status(404).json({msg: 'Paket nije pronađen'});

      item = trainer.trainingPackages.find(p => p._id.toString() === itemId);
    } else if (type === 'plan') {
      trainer = await Trainer.findOne({'mealPlans._id': itemId});
      if (!trainer)
        return res.status(404).json({msg: 'Plan ishrane nije pronađen'});

      item = trainer.mealPlans.find(p => p._id.toString() === itemId);
    } else {
      return res.status(400).json({msg: 'Nepoznat tip kupovine'});
    }

    if (!item) return res.status(404).json({msg: 'Artikal nije pronađen'});

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.title,
              description: item.description,
              images: item.coverImage ? [item.coverImage] : [],
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5001/api/payments/success?userId=${userId}&itemId=${itemId}&type=${type}`,
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
  const {userId, itemId, type} = req.query;

  if (!userId || !itemId || !type) {
    return res.status(400).json({msg: 'Nedostaju podaci u query-ju'});
  }

  console.log(`✅ Plaćanje uspešno: ${type}, item: ${itemId}, user: ${userId}`);
  res.redirect(
    `coachbridge://payment-status?status=success&userId=${userId}&type=${type}&itemId=${itemId}`,
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
    const {userId, itemId, type} = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({msg: 'Korisnik nije pronađen'});

    const trainer = await Trainer.findOne({
      [`${type === 'package' ? 'trainingPackages' : 'mealPlans'}._id`]: itemId,
    });

    if (!trainer) return res.status(404).json({msg: 'Trener nije pronađen'});

    const itemList =
      type === 'package' ? trainer.trainingPackages : trainer.mealPlans;
    const item = itemList.find(i => i._id.toString() === itemId);
    if (!item) return res.status(404).json({msg: 'Artikal nije pronađen'});

    // Dodaj u korisnikov nalog
    if (type === 'package') {
      if (!user.purchasedPackages.includes(itemId)) {
        user.purchasedPackages.push(itemId);
      }
    } else {
      if (!user.purchasedMealPlans.includes(itemId)) {
        user.purchasedMealPlans.push(itemId);
      }
    }

    // Dodaj zaradu treneru
    trainer.wallet.totalEarnings += item.price;
    trainer.wallet.availableForPayout += item.price;

    await Promise.all([user.save(), trainer.save()]);

    res.json({msg: 'Kupovina uspešno zabeležena'});
  } catch (err) {
    console.error('❌ Greška pri potvrdi plaćanja:', err);
    res.status(500).json({msg: 'Greška na serveru'});
  }
});

module.exports = router;

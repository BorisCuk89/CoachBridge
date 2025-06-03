const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    profileImage: {type: String}, // URL slike
    introVideo: {type: String}, // URL introVideo
    title: {type: String, required: true}, // npr. "Personalni trener", "Trener snage"
    description: {type: String, required: true}, // Kratak opis trenera
    certificates: [{type: String}], // Lista URL-ova sertifikata
    rating: {type: Number, default: 0}, // Prosečna ocena
    reviews: [
      {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: {type: Number, required: true},
        comment: {type: String},
      },
    ],
    trainingPackages: [
      {
        title: {type: String, required: true}, // Naziv paketa
        description: {type: String, required: true}, // Opis paketa
        price: {type: Number, required: true}, // Cena paketa
        coverImage: {type: String}, // ✅ Cover slika paketa
        introVideo: {type: String}, // ✅ Intro video
        videos: [
          {
            title: {type: String, required: true}, // Naziv videa
            videoUrl: {type: String, required: true}, // URL videa
          },
        ],
        createdAt: {type: Date, default: Date.now},
      },
    ],
    mealPlans: [
      {
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        coverImage: {type: String}, // ✅ Cover slika paketa
        introVideo: {type: String}, // ✅ Intro video
        createdAt: {type: Date, default: Date.now},
      },
    ],
    wallet: {
      totalEarnings: {type: Number, default: 0}, // Ukupna zarada
      availableForPayout: {type: Number, default: 0}, // Dostupno za isplatu
    },
  },
  {
    timestamps: true, // ✅ OVDE DODATO
  },
);

module.exports = mongoose.model('Trainer', TrainerSchema);

const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profileImage: {type: String}, // URL slike
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
      videos: [
        {
          title: {type: String, required: true}, // Naziv videa
          duration: {type: Number, required: true}, // Trajanje u minutima
          videoUrl: {type: String, required: true}, // URL videa
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Trainer', TrainerSchema);

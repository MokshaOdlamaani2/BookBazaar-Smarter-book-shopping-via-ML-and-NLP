const mongoose = require('mongoose');

const userFavoriteSchema = new mongoose.Schema({
  userId: {
    type: String, // or mongoose.Schema.Types.ObjectId if users are in MongoDB
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  }
}, { timestamps: true });

userFavoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true }); // prevent duplicates

module.exports = mongoose.model('UserFavorite', userFavoriteSchema);

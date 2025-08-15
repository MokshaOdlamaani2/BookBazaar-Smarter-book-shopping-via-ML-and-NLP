import mongoose from 'mongoose';

const userFavoriteSchema = new mongoose.Schema({
  userId: {
    type: String, // or mongoose.Schema.Types.ObjectId if your users are stored in MongoDB
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  }
}, { timestamps: true });

// Composite unique index to prevent duplicates
userFavoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const UserFavorite = mongoose.model('UserFavorite', userFavoriteSchema);

export default UserFavorite;

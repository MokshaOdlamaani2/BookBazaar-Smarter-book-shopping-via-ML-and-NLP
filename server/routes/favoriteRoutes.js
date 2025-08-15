import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
import UserFavorite from '../models/UserFavorite.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid or missing bookId' });
  }

  try {
    await UserFavorite.updateOne(
      { userId, bookId },
      { $set: { userId, bookId } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Added to favorites' });
  } catch (err) {
    console.error("❌ Add favorite error:", err.message);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

router.delete('/:bookId', protect, async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid bookId for removal' });
  }

  try {
    await UserFavorite.deleteOne({
      userId,
      bookId: new mongoose.Types.ObjectId(bookId),
    });
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error("❌ Remove favorite error:", err.message);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const favorites = await UserFavorite.find({ userId: req.user.id }).populate('bookId');
    const books = favorites.map(f => f.bookId);
    res.json({ favorites: books });
  } catch (err) {
    console.error("❌ Get favorites error:", err.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

export default router;

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const UserFavorite = require('../models/UserFavorite');

// ➕ Add to favorites
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
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Add favorite error:", err.message);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// ❌ Remove from favorites
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
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Remove favorite error:", err.message);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// 📥 Get all favorites
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

module.exports = router;

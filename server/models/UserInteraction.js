const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if using real User ref
    required: true,
  },
  bookId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if referencing Book
    required: true,
  },
  type: {
    type: String,
    enum: ['view', 'click', 'favorite'],
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Unique combination of user, book, and type to track each interaction type
userInteractionSchema.index({ userId: 1, bookId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('UserInteraction', userInteractionSchema);

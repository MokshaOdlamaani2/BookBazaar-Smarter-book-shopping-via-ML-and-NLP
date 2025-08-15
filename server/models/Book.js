// models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: [String], default: ['Unknown'] },
  summary: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  condition: { type: String, enum: ['New', 'Used'], default: 'Used' },
  genre: { type: [String], default: ['General'] },
  image: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: { type: [String], default: [] }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;

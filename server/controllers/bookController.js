import Book from '../models/Book.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ➕ Add book
export const addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, author, summary, genre, price, condition } = req.body;
    const image = req.file ? req.file.filename : null;

    const lastBook = await Book.findOne().sort({ index: -1 });
    const newIndex = lastBook ? lastBook.index + 1 : 1;

    const book = new Book({
      title,
      author,
      summary,
      genre,
      price,
      condition,
      image,
      seller: req.user._id || req.user.id,
      index: newIndex,
    });

    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Error adding book:', err.message);
    res.status(500).json({ error: 'Failed to add book' });
  }
};

// 📃 My Books
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id || req.user.id });
    res.json(books);
  } catch (err) {
    console.error('Error fetching user books:', err.message);
    res.status(500).json({ error: 'Failed to fetch your books' });
  }
};

// ❌ Delete
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.seller.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (book.image) {
      const imgPath = path.join(__dirname, '..', 'uploads', book.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
};

// ✏️ Update
export const updateBook = async (req, res) => {
  try {
    const { title, author, summary, price, condition, genre } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.seller.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(book, { title, author, summary, price, condition, genre });

    if (req.file) {
      const oldPath = path.join(__dirname, '..', 'uploads', book.image);
      if (book.image && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      book.image = req.file.filename;
    }

    await book.save();
    res.json({ message: 'Book updated', book });
  } catch (err) {
    console.error('Error updating book:', err.message);
    res.status(500).json({ message: 'Server error updating book' });
  }
};

// 🔍 All books with filters and pagination
export const getAllBooks = async (req, res) => {
  try {
    const { genre, condition, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (genre) query.genre = genre;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const books = await Book.find(query)
      .populate('seller', 'name email')
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);
    const hasMore = skip + books.length < total;

    res.json({ books, hasMore });
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// 📥 Fetch books by IDs
export const getBooksByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    const idArray = ids?.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
    if (!idArray || idArray.length === 0) return res.status(400).json({ error: 'Invalid or missing IDs' });

    const books = await Book.find({ _id: { $in: idArray } });
    res.json(books);
  } catch (err) {
    console.error('Error fetching books by IDs:', err.message);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// 🎯 Get books by genre
export const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) return res.status(400).json({ error: 'Genre is required' });

    const books = await Book.find({ genre: { $in: [genre] } });
    res.json({ books });
  } catch (err) {
    console.error('Error fetching books by genre:', err.message);
    res.status(500).json({ error: 'Failed to fetch books by genre' });
  }
};

// 📄 Get one book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('seller', 'name email');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error('Error fetching book by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

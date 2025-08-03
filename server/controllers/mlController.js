const axios = require('axios');
const Book = require('../models/Book');

exports.predictGenre = async (req, res) => {
  const { summary } = req.body;
  try {
    const response = await axios.post('http://localhost:5001/predict-genre', { summary });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Genre prediction failed:', err.message);
    res.status(500).json({ error: 'Genre prediction failed' });
  }
};

exports.extractTags = async (req, res) => {
  const { summary } = req.body;
  try {
    const response = await axios.post('http://localhost:5001/extract-tags', { summary });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Tag extraction failed:', err.message);
    res.status(500).json({ error: 'Tag extraction failed' });
  }
};

// 🔠 Autocomplete search suggestions
exports.getAutocompleteSuggestions = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query (q) is required' });

  try {
    const regex = new RegExp(`^${query}`, 'i');

    const titles = await Book.find({ title: regex }).limit(5).select('title');
    const authors = await Book.find({ author: regex }).limit(5).select('author');

    const suggestions = [
      ...titles.map(b => b.title),
      ...authors.map(b => b.author)
    ];

    const unique = Array.from(new Set(suggestions)).slice(0, 10);
    res.json({ suggestions: unique });
  } catch (err) {
    console.error('❌ Autocomplete error:', err.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};

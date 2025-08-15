import axios from 'axios';
import Book from '../models/Book.js';

// Rate limiter config
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 50;
const requestCounts = new Map();

export function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, firstRequest: now });
  } else {
    const data = requestCounts.get(ip);
    if (now - data.firstRequest < rateLimitWindowMs) {
      data.count++;
      if (data.count > maxRequestsPerWindow) {
        return res.status(429).json({ error: 'Too many ML requests. Try again later.' });
      }
    } else {
      requestCounts.set(ip, { count: 1, firstRequest: now });
    }
  }
  next();
}

export async function extractTags(req, res) {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ error: 'bookId is required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.tags && book.tags.length > 0) {
      return res.json({ tags: book.tags, cached: true });
    }

    const mlRes = await axios.post(`${process.env.ML_SERVICE_URL}/extract-tags`, {
      summary: book.summary,
    });

    const tags = mlRes.data.tags || [];

    book.tags = tags;
    await book.save();

    res.json({ tags, cached: false });
  } catch (err) {
    console.error('❌ Tag extraction failed:', err.message);

    if (err.response && err.response.status === 429) {
      return res.status(429).json({
        error: 'ML API rate limit hit. Returning fallback tags.',
        tags: ['Book', 'Reading', 'Fiction'],
      });
    }

    res.status(500).json({ error: 'Tag extraction failed' });
  }
}

export async function predictGenre(req, res) {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ error: 'Summary is required' });

    async function callWithRetry(url, data, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          return await axios.post(url, data);
        } catch (err) {
          if (err.response && err.response.status === 429 && i < retries - 1) {
            const wait = delay * Math.pow(2, i);
            console.warn(`⏳ Rate limited. Retrying in ${wait}ms...`);
            await new Promise(resolve => setTimeout(resolve, wait));
          } else {
            throw err;
          }
        }
      }
    }

    const mlRes = await callWithRetry(`${process.env.ML_SERVICE_URL}/predict-genre`, { summary });

    const genre = mlRes.data.genre || ['General'];
    res.json({ predicted_genre: genre });
  } catch (err) {
    console.error('❌ Genre prediction failed:', err.message);

    if (err.response && err.response.status === 429) {
      return res.status(429).json({
        error: 'ML API rate limit hit. Returning fallback genre.',
        predicted_genre: ['General'],
      });
    }

    res.status(500).json({ error: 'Genre prediction failed' });
  }
}

export async function getAutocompleteSuggestions(req, res) {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    // Dummy autocomplete suggestions
    const suggestions = [
      query + ' book',
      query + ' author',
      query + ' genre',
    ];

    res.json({ suggestions });
  } catch (err) {
    console.error('❌ Autocomplete failed:', err.message);
    res.status(500).json({ error: 'Autocomplete failed' });
  }
}

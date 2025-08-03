const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');

// 🔮 Predict genre
router.post('/predict-genre', mlController.predictGenre);

// 🏷 Extract tags from summary
router.post('/extract-tags', mlController.extractTags);

// 🔠 Autocomplete search suggestions
router.get('/autocomplete', mlController.getAutocompleteSuggestions);

// Optional error handler
router.use((err, req, res, next) => {
  console.error("ML Route Error:", err.stack);
  res.status(500).json({ error: 'Something went wrong in ML routes.' });
});

module.exports = router;

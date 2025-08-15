// routes/mlRoutes.js
import express from 'express';
import {
  predictGenre,
  extractTags,
  getAutocompleteSuggestions,
  rateLimiter,
} from '../controllers/mlController.js';

const router = express.Router();

router.use(rateLimiter);

router.post('/predict-genre', predictGenre);
router.post('/extract-tags', extractTags);
router.get('/autocomplete', getAutocompleteSuggestions);

router.use((err, req, res, next) => {
  console.error('ML Route Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong in ML routes.' });
});

export default router;

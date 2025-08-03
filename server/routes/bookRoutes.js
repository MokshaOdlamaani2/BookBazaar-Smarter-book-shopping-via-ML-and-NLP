const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const bookController = require('../controllers/bookController');

// 📦 Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// 🔐 Routes
router.post('/add', protect, upload.single('image'), bookController.addBook);
router.put('/:id', protect, upload.single('image'), bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);

router.get('/all', bookController.getAllBooks);
router.get('/my-books', protect, bookController.getMyBooks);
router.get('/genre', bookController.getBooksByGenre);
router.get('/by-ids', bookController.getBooksByIds);

// 🔚 Must be last
router.get('/:id', bookController.getBookById);

module.exports = router;

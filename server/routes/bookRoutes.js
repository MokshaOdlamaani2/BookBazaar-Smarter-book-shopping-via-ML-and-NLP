import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';  // note the .js extension if you use ES Modules
import * as bookController from '../controllers/bookController.js';

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Ensure 'uploads/' folder exists and is writable
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Protected routes with authentication
router.post('/add', protect, upload.single('image'), bookController.addBook);
router.put('/:id', protect, upload.single('image'), bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);
router.get('/my-books', protect, bookController.getMyBooks);

// Public routes
router.get('/all', bookController.getAllBooks);
router.get('/genre', bookController.getBooksByGenre);
router.get('/by-ids', bookController.getBooksByIds);

// This route must come last to prevent conflict with above routes
router.get('/:id', bookController.getBookById);

export default router;

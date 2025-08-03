const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route imports
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const mlRoutes = require('./routes/mlRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'BookBazaarDB',
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// ✅ Route mounting
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Home route
app.get('/', (req, res) => {
  res.send('📚 Welcome to BookBazaar API');
});

// ❌ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 🛠 Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

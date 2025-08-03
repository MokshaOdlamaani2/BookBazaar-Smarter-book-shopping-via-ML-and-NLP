const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI; // Ensure your .env has the correct Atlas URI

async function removeIndexes() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'BookBazaarDB' });

    const db = mongoose.connection.db;
    const indexes = await db.collection('books').indexes();

    for (const idx of indexes) {
      if (idx.name !== '_id_') {
        await db.collection('books').dropIndex(idx.name);
        console.log(`✅ Dropped index: ${idx.name}`);
      }
    }

    console.log('🎉 All non-default indexes removed.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error removing indexes:', err.message);
  }
}

removeIndexes();

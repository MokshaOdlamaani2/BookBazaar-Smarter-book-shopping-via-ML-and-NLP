// server/seedBooks.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const Book = require("./models/Book");

dotenv.config();

const genres = ["Fantasy", "Science", "Romance", "History", "Biography", "Fiction"];
let index = 1000; // Unique index to match ML requirement

// Fetch books from Google Books API for a given genre
const fetchBooksForGenre = async (genre, maxResults = 20) => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${maxResults}`;
    const response = await axios.get(url);
    const items = response.data.items || [];

    return items.map((item) => {
      const volume = item.volumeInfo;

      return {
        index: index++,
        title: volume.title || "Untitled",
        author: volume.authors || ["Unknown"],
        summary: volume.description || "No description available.",
        genre: [genre],
        price: Math.floor(Math.random() * 400) + 100,
        condition: Math.random() > 0.5 ? "New" : "Used",
        image: volume.imageLinks?.thumbnail || "", // Fetching image URL
      };
    });
  } catch (err) {
    console.error(`❌ Error fetching ${genre} books:`, err.message);
    return [];
  }
};

// Main seed function
const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "BookBazaarDB",
    });

    console.log("✅ Connected to MongoDB");

    let allBooks = [];

    for (let genre of genres) {
      const books = await fetchBooksForGenre(genre, 20);
      allBooks = [...allBooks, ...books];
      console.log(`📚 Fetched ${books.length} books for genre: ${genre}`);
    }

    await Book.insertMany(allBooks);
    console.log(`✅ Inserted ${allBooks.length} books with images to DB`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedBooks();

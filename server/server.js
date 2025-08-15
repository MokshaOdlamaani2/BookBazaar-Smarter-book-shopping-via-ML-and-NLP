import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploads statically
app.use("/uploads", express.static(uploadDir));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/contact", contactRoutes);

// Routes requiring authentication (protect middleware)
app.use("/api/books", protect, bookRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/favorites", protect, favoriteRoutes);

// Optional: a public root route
app.get("/", (req, res) => res.send("Welcome to BookBazaar API"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

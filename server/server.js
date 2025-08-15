import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
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

// Use routers
app.use("/api/ml", mlRoutes);

// Protect routes that need authentication
app.use("/api/books", protect, bookRoutes);

// Optional: a public route example without auth (e.g. home page)
app.get("/", (req, res) => res.send("Welcome to BookBazaar API"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

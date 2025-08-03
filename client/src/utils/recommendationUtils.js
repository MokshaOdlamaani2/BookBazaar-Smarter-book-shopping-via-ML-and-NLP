// 📁 src/utils/recommendationUtils.js
import axios from "axios";
import { addFavorite, removeFavorite } from "./favorites";

const API_BASE = "http://localhost:5000/api";
const INTERACTION_API = `${API_BASE}/interactions`;
const BOOKS_BY_IDS_API = `${API_BASE}/books/by-ids`;

// 📌 Save interaction to backend and localStorage
export const saveInteraction = async (bookId, type = "view") => {
  try {
    const userId = localStorage.getItem("userId");

    if (type === "view" || type === "click") {
      let history = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      history = history.filter((id) => id !== bookId).concat(bookId).slice(-10);
      localStorage.setItem("recentlyViewed", JSON.stringify(history));
    }

    if (userId) {
      await axios.post(INTERACTION_API, { userId, bookId, type });
    }
  } catch (err) {
    console.error("❌ Failed to save interaction:", err.message);
  }
};

// 📥 Get full book details for recently viewed books
export const getRecentlyViewedBooks = async () => {
  try {
    const storedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (storedIds.length === 0) return [];

    const res = await axios.get(BOOKS_BY_IDS_API, {
      params: { ids: storedIds.join(",") },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch recently viewed books:", err.message);
    return [];
  }
};

// ❤️ Get liked book IDs from localStorage
export const getLikedBooks = () => {
  try {
    return JSON.parse(localStorage.getItem("likedBooks") || "[]");
  } catch {
    return [];
  }
};

// ❤️ Toggle like and sync with backend
export const toggleLikeBook = (bookId) => {
  let liked = getLikedBooks();
  const userId = localStorage.getItem("userId");
  let actionType = "like";

  if (liked.includes(bookId)) {
    liked = liked.filter((id) => id !== bookId);
    removeFavorite(bookId);
    actionType = "unlike";
  } else {
    liked.push(bookId);
    addFavorite(bookId);
  }

  localStorage.setItem("likedBooks", JSON.stringify(liked));

  if (userId) {
    axios.post(INTERACTION_API, {
      userId,
      bookId,
      type: actionType,
    }).catch((err) => console.error(`❌ Failed to record ${actionType}:`, err.message));
  }
};

// 🛒 Add to cart
export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export const addToCart = (book) => {
  const cart = getCartItems();
  if (!cart.find((b) => b._id === book._id)) {
    const updated = [...cart, book];
    localStorage.setItem("cart", JSON.stringify(updated));
    saveInteraction(book._id, "cart");
    return true;
  }
  return false;
};



export const getAutoComplete = async (query) => {
  if (!query) return [];
  try {
    const res = await axios.get(`${API_BASE}/autocomplete?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    console.error("Autocomplete error:", err.message);
    return [];
  }
};

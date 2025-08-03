import axios from 'axios';

const API = "http://localhost:5000/api/favorites";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ➕ Add to favorites
export const addFavorite = async (bookId) => {
  if (!bookId) return console.warn("⚠️ No bookId passed to addFavorite");
  try {
    await axios.post(API, { bookId }, getAuthHeaders());
  } catch (err) {
    console.error("❌ Add favorite error:", err.message);
  }
};

// ❌ Remove from favorites
export const removeFavorite = async (bookId) => {
  if (!bookId) return console.warn("⚠️ No bookId passed to removeFavorite");
  try {
    await axios.delete(`${API}/${bookId}`, getAuthHeaders());
  } catch (err) {
    console.error("❌ Remove favorite error:", err.message);
  }
};

// 📥 Get all favorites
export const getFavorites = async () => {
  try {
    const res = await axios.get(API, getAuthHeaders());
    return res.data.favorites || [];
  } catch (err) {
    console.error("❌ Get favorites error:", err.message);
    return [];
  }
};

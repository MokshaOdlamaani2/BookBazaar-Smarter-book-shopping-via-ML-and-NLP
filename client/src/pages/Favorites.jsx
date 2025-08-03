import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../utils/favorites";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import '../styles/bookDetail.css';
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch (err) {
        toast.error("❌ Failed to load favorites");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (bookId) => {
    if (!bookId) return console.warn("⚠️ Invalid bookId for removal");
    try {
      await removeFavorite(bookId);
      setFavorites((prev) => prev.filter((b) => b._id !== bookId));
      toast.info("❌ Removed from favorites");
    } catch (err) {
      toast.error("⚠️ Could not remove from favorites");
      console.error(err);
    }
  };

  return (
    <div className="favorites-page">
      <h2>❤️ Your Favorite Books</h2>

      {loading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="book-gridf">
          {favorites.map((book) => (
            <div className="book-cardf" key={book._id}>
              <img
                src={
                  book.image?.startsWith("http")
                    ? book.image
                    : `http://localhost:5000/uploads/${book.image}`
                }
                alt={book.title}
                className="book-thumb"
              />
              <div className="book-info">
                <h4>{book.title}</h4>
                <p><strong>Author:</strong> {Array.isArray(book.author) ? book.author.join(", ") : book.author}</p>
                <p><strong>Genre:</strong> {Array.isArray(book.genre) ? book.genre.join(", ") : book.genre}</p>
                <div className="book-actions">
                  <button onClick={() => handleRemove(book._id)}>Remove</button>
                  <Link to={`/books/${book._id}`}>View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

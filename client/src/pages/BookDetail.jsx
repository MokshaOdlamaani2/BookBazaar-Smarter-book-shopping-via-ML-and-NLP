import { useParams, Link } from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/bookDetail.css';
import ContactForm from '../components/ContactForm';
import { toast } from 'react-toastify';
import {
  saveInteraction,
  getLikedBooks,
  toggleLikeBook
} from '../utils/recommendationUtils';
import { addFavorite, removeFavorite } from '../utils/favorites';
import { addToCart } from '../utils/recommendationUtils';

const API = process.env.REACT_APP_API_BASE_URL;

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [likedBooks, setLikedBooks] = useState(getLikedBooks());

  useEffect(() => {
    saveInteraction(id, "view");

    const fetchBookAndExtras = async () => {
      try {
        const res = await axios.get(`${API}/api/books/${id}`);
        const bookData = res.data;
        setBook(bookData);

        if (bookData.summary) {
          const tagRes = await axios.post(`${API}/api/ml/extract-tags`, {
            summary: bookData.summary,
          });
          setTags(tagRes.data.tags || []);
        }

        if (bookData.genre) {
          const genreQuery = Array.isArray(bookData.genre) ? bookData.genre[0] : bookData.genre;
          const genreRes = await axios.get(`${API}/api/books/genre`, {
            params: { genre: genreQuery }
          });
          const filteredBooks = genreRes.data.books.filter(b => b._id !== id);
          setSimilarBooks(filteredBooks);
        }
      } catch (err) {
        toast.error("Failed to load book");
        console.error("BookDetail fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndExtras();
  }, [id]);

  const handleToggleLike = async () => {
    const alreadyLiked = likedBooks.includes(id);

    try {
      if (alreadyLiked) {
        await removeFavorite(id);
        toast.info(`❌ Removed "${book.title}" from favorites`);
      } else {
        await addFavorite(id);
        toast.success(`❤️ Added "${book.title}" to favorites`);
      }

      toggleLikeBook(id);
      setLikedBooks(getLikedBooks());
    } catch (err) {
      toast.error("⚠️ Failed to update favorite");
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    const added = addToCart(book);
    if (added) toast.success(`🛒 "${book.title}" added to cart`);
    else toast.info(`ℹ️ "${book.title}" is already in your cart`);
  };

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="book-detail-container">
      <h2>{book.title}</h2>

      {book.image ? (
        <img
          src={book.image.startsWith('http') ? book.image : `${API}/uploads/${book.image}`}
          alt={book.title}
          className="book-cover"
        />
      ) : (
        <div className="no-image">No Image Available</div>
      )}

      <p><strong>Author:</strong> {Array.isArray(book.author) ? book.author.join(', ') : book.author || "Unknown"}</p>
      <p><strong>Genre:</strong> {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre || "N/A"}</p>
      <p><strong>Condition:</strong> {book.condition || "N/A"}</p>
      <p><strong>Price:</strong> ₹{book.price?.toFixed(2) || "0.00"}</p>
      <p><strong>Summary:</strong> {book.summary || "No description available."}</p>

      {tags.length > 0 && (
        <div className="tag-section">
          <p><strong>Keywords in book</strong></p>
          <ul className="tag-list">
            {tags.map((tag, i) => (
              <li key={i} className="tag">{tag}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="detail-actions">
        <button className="like-btn" onClick={handleToggleLike}>
          {likedBooks.includes(id) ? "❤️ Liked" : "🤍 Like"}
        </button>
        <button className="cart-btn" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>

      <hr />

      <h4>Seller Info</h4>
      <p><strong>Name:</strong> {book.seller?.name || "N/A"}</p>
      <p><strong>Email:</strong> {book.seller?.email || "N/A"}</p>

      {book.seller?.email && <ContactForm sellerEmail={book.seller.email} />}

      {similarBooks.length > 0 && (
        <div className="recommendations">
          <hr />
          <h3 className="rec-title">📚 You may also like:</h3>
          <div className="book-grid">
            {similarBooks.slice(0, 8).map((rec) => (
              <div className="book-card" key={rec._id}>
                <img
                  src={rec.image?.startsWith('http') ? rec.image : `${API}/uploads/${rec.image}`}
                  alt={rec.title}
                  className="book-thumbnail"
                />
                <h5 className="rec-book-title">{rec.title}</h5>
                <Link
                  to={`/books/${rec._id}`}
                  className="view-link"
                  onClick={() => saveInteraction(rec._id, "click")}
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;

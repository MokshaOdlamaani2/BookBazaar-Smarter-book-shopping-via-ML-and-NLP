import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/myListings.css';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_BASE_URL;

const MyListings = () => {
  const [books, setBooks] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchMyBooks = async () => {
      try {
        const res = await axios.get(`${API}/api/books/my-books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
      } catch (err) {
        toast.error('Failed to fetch listings');
      }
    };

    fetchMyBooks();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;

    try {
      await axios.delete(`${API}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!token) {
    return (
      <div className="my-listings-container">
        <h2>📚 My Book Listings</h2>
        <p>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to view your listings.
        </p>
      </div>
    );
  }

  return (
    <div className="my-listings-container">
      <h2 className="my-listings-title">📚 My Book Listings</h2>

      {books.length === 0 ? (
        <p className="no-books-msg">You haven’t listed any books yet.</p>
      ) : (
        <div className="my-books-grid">
          {books.map((book) => (
            <div className="book-card" key={book._id}>
              {book.image && (
                <img
                  src={
                    book.image.startsWith('http')
                      ? book.image
                      : `${API}/uploads/${book.image}`
                  }
                  alt={book.title}
                  className="book-thumbnail"
                />
              )}
              <h4>{book.title}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Price:</strong> ₹{book.price}</p>

              <div className="book-actions">
                <Link to={`/edit-book/${book._id}`}>
                  <button className="edit-btn">✏️ Edit</button>
                </Link>
                <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;

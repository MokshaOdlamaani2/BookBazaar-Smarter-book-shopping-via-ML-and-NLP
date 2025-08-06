import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/addBook.css';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    summary: '',
    price: '',
    condition: '',
    genre: '',
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const token = localStorage.getItem('token');
const API = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBook = async () => {
      if (!id || id.length !== 24) return;
      try {
        const res = await axios.get(`${API}/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Book not found or an error occurred.');
        setTimeout(() => navigate('/my-listings'), 3000);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePredictGenre = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/ml/predict-genre`, {
        summary: book.summary,
      });
      setBook({ ...book, genre: res.data.predicted_genre });
      toast.success('Genre predicted successfully');
    } catch (err) {
      toast.error('Genre prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(book).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const endpoint = id
  ? `${API}/api/books/${id}`
  : `${API}/api/books/add`;

    const method = id ? axios.put : axios.post;

    try {
      await method(endpoint, formData, config);
      toast.success(`Book ${id ? 'updated' : 'added'} successfully`);
      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save book. Please check inputs or try again later.');
    }
  };

  return (
    <div className="add-book-form">
      <h2>{id ? 'Edit Book' : 'Sell a Book'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Author"
        />
        <textarea
          name="summary"
          value={book.summary}
          onChange={handleChange}
          placeholder="Summary"
          required
        />

        <button
          type="button"
          onClick={handlePredictGenre}
          disabled={loading || !book.summary}
        >
          {loading ? 'Predicting...' : 'Predict Genre'}
        </button>

        <input
          name="genre"
          value={book.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
        />
        <input
          name="price"
          type="number"
          value={book.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <label htmlFor="condition">Condition</label>
        <select
          name="condition"
          value={book.condition}
          onChange={handleChange}
          required
        >
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <p>Selected Image: {image.name}</p>}

        {id && book.image && !image && (
          <div>
            <p>
              Current Image:{' '}
              <a
                href={`http://localhost:5000/uploads/${book.image}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </p>
            <img
              src={`http://localhost:5000/uploads/${book.image}`}
              alt="Preview"
              style={{ maxHeight: '120px', marginBottom: '10px' }}
            />
          </div>
        )}

        {id && (
          <Link to={`/books/${id}`}>
            <button type="button">View Details</button>
          </Link>
        )}

        <button type="submit">{id ? 'Update Book' : 'Add Book'}</button>
      </form>
    </div>
  );
};

export default BookForm;

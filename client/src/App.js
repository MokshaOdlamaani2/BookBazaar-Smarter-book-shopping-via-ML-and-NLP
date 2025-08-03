import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BrowseBooks from './pages/BrowseBooks';
import BookForm from './pages/BookForm';
import BookDetail from './pages/BookDetail';
import MyListings from './pages/MyListings';
import Register from './pages/Register';
import Login from './pages/Login';
import ContactForm from './components/ContactForm';
import Cart from './pages/Cart';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Favorites from './pages/Favorites';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<BrowseBooks />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/my-listings"
            element={
              <PrivateRoute>
                <MyListings />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-book"
            element={
              <PrivateRoute>
                <BookForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-book/:id"
            element={
              <PrivateRoute>
                <BookForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* ✅ Toast container must be outside Routes */}
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;

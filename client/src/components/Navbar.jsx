import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    setLoggedIn(!!token);
    setUsername(token ? name : '');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">📚 BookBazaar</Link>
        <Link to="/add-book">Sell</Link>
        <Link to="/my-listings">My Listings</Link>
        <Link to="/favorites">🖤</Link>
      </div>

      <div className="navbar-right">
        <Link to="/cart">🛒 Cart</Link>

        {loggedIn ? (
          <>
            <span className="navbar-username">👤 {username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

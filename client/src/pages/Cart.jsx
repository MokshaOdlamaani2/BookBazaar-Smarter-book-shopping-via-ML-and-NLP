import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../styles/myListings.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    if (token) {
      fetchPastOrders();
    }
  }, [token]);

  const fetchPastOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch past orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleRemove = (bookId) => {
    const updatedCart = cartItems.filter((item) => item._id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.info("Removed");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!token) {
      toast.error("Please login to place an order");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cartItems,
          total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("cart");
      setCartItems([]);
      toast.success("Order placed successfully");
      fetchPastOrders();
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    }
  };

  const total = useMemo(
    () => cartItems.reduce((sum, book) => sum + (Number(book.price) || 0), 0),
    [cartItems]
  );

  if (!token) {
    return (
      <div className="cart-container">
        <h2>🛒 Your Cart</h2>
        <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to access your cart and orders.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((book) => (
              <li key={book._id} className="cart-item">
                <img
                  src={
                    book.image?.startsWith("http")
                      ? book.image
                      : `http://localhost:5000/uploads/${book.image}`
                  }
                  alt={book.title}
                  className="cart-thumb"
                />
                <div>
                  <h4>{book.title}</h4>
                  <p>Author: {book.author}</p>
                  <p>Price: ₹{Number(book.price).toFixed(2)}</p>
                  <button onClick={() => handleRemove(book._id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="checkout-summary">
            <p>
              <strong>Total:</strong> ₹{total.toFixed(2)}
            </p>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* Past Orders */}
      {loadingOrders ? (
        <p>Loading your past orders...</p>
      ) : pastOrders.length > 0 ? (
        <section className="past-orders">
          <h3>Your Past Orders</h3>
          {pastOrders.map((order) => (
            <div key={order._id} className="order-card">
              <p>
                <strong>Ordered on:</strong>{" "}
                {new Date(order.orderedAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ₹{Number(order.total).toFixed(2)}
              </p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={item.bookId || idx}>
                    {item.title || "Untitled"} - ₹
                    {Number(item.price).toFixed(2)} x {item.quantity || 1}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : (
        <p>No past orders yet.</p>
      )}
    </div>
  );
};

export default Cart;

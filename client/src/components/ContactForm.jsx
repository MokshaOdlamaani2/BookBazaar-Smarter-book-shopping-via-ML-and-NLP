import { useState } from "react";
import axios from "axios";
import "../styles/addBook.css";

const ContactForm = ({ sellerEmail }) => {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await axios.post("http://localhost:5000/api/contact", {
        sellerEmail,
        buyerName,
        buyerEmail,
        message,
      });
      setStatus("Message sent successfully!");
      setBuyerName("");
      setBuyerEmail("");
      setMessage("");
    } catch {
      setStatus("Failed to send message.");
    }
  };

  return (
    <div className="contact-form">
      <h3>Contact Seller</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ContactForm;

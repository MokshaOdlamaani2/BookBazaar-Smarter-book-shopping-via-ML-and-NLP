// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String
  }],
  total: { type: Number, required: true },
  orderedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

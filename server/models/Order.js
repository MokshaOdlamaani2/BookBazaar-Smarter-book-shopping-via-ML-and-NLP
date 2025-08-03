const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 }, // default quantity to 1
    image: String
  }],
  total: { type: Number, required: true },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);

const Order = require("../models/Order");


// Place an order


exports.placeOrder = async (req, res) => {
  const { items, total } = req.body;
  if (!items || !items.length || !total) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    const newOrder = await Order.create({ user: req.user.id, items, total });
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ orderedAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed fetching orders' });
  }
};

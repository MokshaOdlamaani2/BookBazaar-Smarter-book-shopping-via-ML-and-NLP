const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { placeOrder, getOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);

module.exports = router;

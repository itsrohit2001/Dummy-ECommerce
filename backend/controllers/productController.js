const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const { verifyAccessToken } = require('../utils/sessionManager');

// GET /api/products
exports.getAllProducts = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 6;
  const id = req.query.id;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const brand = req.query.brand || "";

  if (id && id !== "undefined") {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(id);
    if (product) return res.json(product);
    return res.status(404).json({ message: "Product not found" });
  }

  const query = {};
  if (category && category !== "All") query.category = category;
  if (brand && brand !== "All") query.brand = brand;
  if (search) query.$or = [
    { name: { $regex: search, $options: "i" } },
    { brand: { $regex: search, $options: "i" } }
  ];

  const products = await Product.find(query).skip(skip).limit(limit);
  const count = await Product.countDocuments(query);

  res.json({ products, count });
};

// GET /api/products/popular
exports.getPopularProducts = async (req, res) => {
  const count = parseInt(req.query.count) || 3;
  const products = await Product.find().sort({ rating: -1, reviews: -1 }).limit(count);
  res.json(products);
};

// POST /api/products/place-order
exports.placeOrder = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.status(401).json({ message: "unauthorised" });
  const user = verifyAccessToken(accessToken);

  if (!user) return res.status(401).json({ message: "unauthorised" });
  const { cartItems, address } = req.body;

  if (!cartItems || !address) {
    return res.status(400).json({ message: "Cart items and address are required" });
  }

   // Find user document to get ObjectId
  const userDoc = await User.findOne({ email: user.email });
  if (!userDoc) return res.status(401).json({ message: "User not found" });

  // Map cartItems to order items
  const orderItems = cartItems.map(item => ({
    product: item._id || item.id,
    quantity: item.quantity || 1,
    price: item.price
  }));

  const order = new Order({
    user: userDoc._id,
    items: orderItems,
    address: address,
    status: "Ordered",
    orderDate: new Date(),
  });

  await order.save();
  
  return res.status(201).json({ message: "Order Placed Successfully" });
};
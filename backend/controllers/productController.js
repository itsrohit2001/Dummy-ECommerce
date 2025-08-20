const Product = require('../models/productModel');
const { verifyAccessToken } = require('../utils/sessionManager');

// GET /api/products
exports.getAllProducts = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 6;
  const id = req.query.id;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const brand = req.query.brand || "";

  if (id) {
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
  // Store order info as a subdocument in Product (or you can create a separate Order collection if needed)
  // Here, just acknowledge the order
  return res.status(201).json({ message: "Order Placed Successfully" });
};
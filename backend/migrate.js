// const mongoose = require("mongoose");
// const User = require("./models/userModel");
// const Product = require("./models/productModel");
// const Order = require("./models/orderModel");
// const fs = require("fs");

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://rkdtg2050:c2UzU5C05VPOqcZm@ecommerce-cluster1.n8qldz9.mongodb.net/ecommerce?retryWrites=true&w=majority")
//   .then(async () => {
//     // Users
//     const users = JSON.parse(fs.readFileSync("./data/user_data.json", "utf-8"));
//     for (const user of users) {
//       await User.updateOne({ email: user.email }, user, { upsert: true });
//       console.log("Inserted user:", user.email);
//     }

//     // Products
//     const products = require("./data/product_data.js").product_data;
//     for (const product of products) {
//       await Product.updateOne({ name: product.name }, product, { upsert: true });
//       console.log("Inserted product:", product.name);
//     }

//     // Orders
//     const orders = JSON.parse(fs.readFileSync("./data/order_list.json", "utf-8"));
//     for (const order of orders) {
//       try {
//         await Order.create(order);
//         console.log("Inserted order:", order);
//       } catch (err) {
//         console.error("Order insert error:", err.message);
//       }
//     }

//     mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error("Migration error:", err);
//   });
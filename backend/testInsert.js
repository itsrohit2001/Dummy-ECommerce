// testInsert.js
const mongoose = require("mongoose");
const User = require("./models/userModel");

mongoose.connect("mongodb+srv://rkdtg2050:c2UzU5C05VPOqcZm@ecommerce-cluster1.n8qldz9.mongodb.net/ecommerce?retryWrites=true&w=majority")
  .then(async () => {
    await User.create({ name: "Test", email: "test@example.com", password: "123456" });
    console.log("Inserted test user");
    mongoose.disconnect();
  });
const mongoose = require("mongoose");

const connectDB =  async () => {
    try {
       const conn = await mongoose.connect(`mongodb+srv://rkdtg2050:c2UzU5C05VPOqcZm@ecommerce-cluster1.n8qldz9.mongodb.net/ecommerce?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error.message);
    process.exit(1);
    }
}

module.exports = connectDB;
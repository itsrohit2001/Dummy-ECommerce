const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 4500;
const routes = require("./routes");
const cors = require('cors');
const connectDB = require('./db');

const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());

//connect to database
connectDB();

app.use((err, req, res, next) => {
  if(err.code === 'ECONNRESET'){
    console.warn('Connection reset by peer');
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use("/api", routes);
app.use("/api/user", require("./routes/userRoutes"));

// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

app.listen(PORT,  () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


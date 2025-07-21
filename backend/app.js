const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 4500;
const routes = require("./routes");
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use((err, req, res, next) => {
  if(err.code === 'ECONNRESET'){
    console.warn('Connection reset by peer');
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use("/api", routes);

// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

app.listen(PORT,  () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const authRoutes=require('./routes/authRoutes');
const app = express();


connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json()); 
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/jobs", require("./routes/jobRoutes"));

app.use('/api/auth',authRoutes);
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
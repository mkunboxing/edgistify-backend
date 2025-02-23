const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import correct function
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authenticate = require("./middleware/authMiddleware");


dotenv.config(); // Load environment variables

const app = express();
app.use(express.json())
app.use(express.urlencoded())

// Middleware
app.use(cors());
app.use(express.json());
//app.use(authenticate);

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

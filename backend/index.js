// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Models
const UserModel = require("./model/UserModel");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

// Middleware
const authMiddleware = require("./middleware/auth");

// Middleware setup
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow mobile apps / curl / postman (no origin)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("CORS blocked: " + origin), false);
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // allow all origins
    },
    credentials: true // allow cookies
  })
);


app.use(express.json());
app.use(cookieParser());

// Environment
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;
const PRICE_SERVER_URL = process.env.PRICE_SERVER_URL;

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------------- ROUTES ----------------------

// ✅ Holdings Routes
app.get("/allHoldings", authMiddleware, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({ userId: req.user.id });
    res.json(allHoldings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching holdings");
  }
});

// ✅ Orders Route
app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});

// ✅ New Order Route
app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || qty === undefined || price === undefined || !mode) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const qtyNum = Number(qty);
    const priceNum = Number(price);

    if (!Number.isFinite(qtyNum) || !Number.isFinite(priceNum)) {
      return res.status(400).json({ msg: "qty and price must be numbers" });
    }

    // Save order
    const newOrder = new OrdersModel({
      userId: req.user.id,
      name,
      qty: qtyNum,
      price: priceNum,
      mode,
    });
    await newOrder.save();

    // Find or update holding
    let holding = await HoldingsModel.findOne({
      userId: req.user.id,
      name,
    });

    if (mode === "BUY") {
      if (holding) {
        // calculate new average properly
        const prevTotalCost = holding.avg * holding.qty;
        const newTotalQty = holding.qty + qtyNum;
        const newTotalCost = prevTotalCost + priceNum * qtyNum;
        holding.avg = newTotalCost / newTotalQty;
        holding.qty = newTotalQty;
        holding.price = priceNum;
        await holding.save();
      } else {
        const newHolding = new HoldingsModel({
          userId: req.user.id,
          name,
          qty: qtyNum,
          avg: priceNum,
          price: priceNum,
          net: "0%",
          day: "0%",
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      if (!holding) return res.status(400).json({ msg: "You don’t own this stock to sell." });
      if (holding.qty < qtyNum) return res.status(400).json({ msg: "Not enough quantity to sell." });

      holding.qty -= qtyNum;
      holding.price = priceNum;

      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    } else {
      return res.status(400).json({ msg: "Invalid mode" });
    }

    res.json({ msg: "Order processed successfully" });
  } catch (err) {
    console.error("Error in /newOrder:", err);
    res.status(500).json({ msg: "Error processing order" });
  }
});

// ---------------------- AUTH ROUTES ----------------------
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ msg: "Please provide all fields" });

    const existingUser = await UserModel.findOne({ email });
    const existingUuser = await UserModel.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });
    if (existingUuser) return res.status(400).json({ msg: "Username is already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

app.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ msg: "Logged out successfully" });
});

// ---------------------- PRICE UPDATE -----------------------------------------
// This endpoint fetches a simulated price from another service (localhost:4000)
// then updates holdings with matching name (for all users that hold that name).


app.get("/getUpdatePrices", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🟢 Fetch only this user's holdings
    const userHoldings = await HoldingsModel.find({ userId });
    if (!userHoldings || userHoldings.length === 0) {
      return res.json({ msg: "No holdings found for this user", updated: [] });
    }

    const updatedHoldings = [];

    // 🕒 For each holding, call your local price API
    for (const holding of userHoldings) {
      try {
        // Get new simulated price from your price server
        const { data } = await axios.get(
  `${process.env.PRICE_SERVER_URL}?stockName=${holding.name}&currentPrice=${holding.price}`
);



        if (data && typeof data.price === "number") {
          const newPrice = data.price;

          // Calculate % change vs avg
          const netPercent = holding.avg
            ? ((newPrice - holding.avg) / holding.avg) * 100
            : 0;

          // Random simulated daily % change
          const dayChange = (Math.random() - 0.5) * 3; // ±3%

          // Update holding in DB
          holding.price = Number(newPrice.toFixed(2));
          holding.net = `${netPercent >= 0 ? "+" : ""}${netPercent.toFixed(2)}%`;
          holding.day = `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`;

          await holding.save();
          updatedHoldings.push(holding);
        }
      } catch (innerErr) {
        console.error(`Failed to update ${holding.name}:`, innerErr.message);
      }
    }

    // ✅ Return updated holdings only for this user
    return res.json(updatedHoldings);
  } catch (err) {
    console.error("Error updating stock prices:", err);
    return res.status(500).json({ msg: "Error updating prices" });
  }
});




// If you want an automatic background updater, uncomment below.
// NOTE: if your price service is running locally you might prefer manual triggers.
// const INTERVAL_MS = 2000; // 2 seconds
// setInterval(async () => {
//   try {
//     // example: update TCS every tick (or you could loop through all distinct names)
//     await axios.get("http://localhost:3002/getUpdatePrices?stockName=TCS");
//   } catch (e) {
//     console.error("Auto-update tick failed:", e.message || e);
//   }
// }, INTERVAL_MS);

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

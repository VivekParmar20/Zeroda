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
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "https://zeroda-fe.onrender.com,https://zeroda-dashboardv2.onrender.com"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile/postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser());

// Prevent the browser from reusing a cached response (with stale CORS
// headers, e.g. from before a server restart) across different origins.
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  console.log("🟡 Incoming request:", req.method, req.path);
  console.log("🟡 Origin:", req.headers.origin);
  console.log("🟡 Cookies:", req.headers.cookie);
  next();
});

// Environment
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;
const PRICE_SERVER_URL = process.env.PRICE_SERVER_URL;

// Simulated opening balance / max margin available per user.
// Mirrors the THRESHOLD constant used for display in the dashboard's
// Funds and Summary pages — kept here so it can actually be enforced.
const OPENING_BALANCE = 3740.0;

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

// ✅ Positions Route
app.get("/allPositions", authMiddleware, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({ userId: req.user.id });
    res.json(allPositions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching positions");
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
    // product: "CNC" (delivery — goes to Holdings, carried overnight) or
    // "MIS" (intraday — goes to Positions, meant to be squared off same day).
    const product = req.body.product === "MIS" ? "MIS" : "CNC";

    if (!name || qty === undefined || price === undefined || !mode) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const qtyNum = Number(qty);
    const priceNum = Number(price);

    if (!Number.isFinite(qtyNum) || !Number.isFinite(priceNum) || qtyNum <= 0) {
      return res.status(400).json({ msg: "qty and price must be valid numbers" });
    }

    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({ msg: "Invalid mode" });
    }

    const PositionOrHoldingModel = product === "MIS" ? PositionsModel : HoldingsModel;

    // Find the existing holding/position first so we know whether the
    // order can actually execute.
    let entry = await PositionOrHoldingModel.findOne({
      userId: req.user.id,
      name,
    });

    // Validate before persisting anything, so a rejected order never
    // silently mutates holdings/positions or leaves a misleading record.
    let rejectReason = null;

    if (mode === "SELL") {
      if (!entry) {
        rejectReason =
          product === "MIS"
            ? "You don’t have an open intraday position in this stock."
            : "You don’t own this stock to sell.";
      } else if (entry.qty < qtyNum) {
        rejectReason = "Not enough quantity to sell.";
      }
    } else if (mode === "BUY") {
      // Margin is shared across delivery holdings AND open intraday
      // positions, so routing through MIS can't bypass the funds check.
      const [existingHoldings, existingPositions] = await Promise.all([
        HoldingsModel.find({ userId: req.user.id }),
        PositionsModel.find({ userId: req.user.id }),
      ]);
      const marginUsed = [...existingHoldings, ...existingPositions].reduce(
        (sum, h) => sum + h.avg * h.qty,
        0
      );
      const marginAvailable = OPENING_BALANCE - marginUsed;
      const orderCost = qtyNum * priceNum;

      if (orderCost > marginAvailable) {
        rejectReason = `Insufficient margin. Available ₹${marginAvailable.toFixed(
          2
        )}, required ₹${orderCost.toFixed(2)}.`;
      }
    }

    if (rejectReason) {
      await new OrdersModel({
        userId: req.user.id,
        name,
        qty: qtyNum,
        price: priceNum,
        mode,
        product,
        status: "REJECTED",
        rejectReason,
      }).save();

      return res.status(400).json({ msg: rejectReason });
    }

    // Order is valid — record it as COMPLETE and apply it to holdings/positions
    const newOrder = new OrdersModel({
      userId: req.user.id,
      name,
      qty: qtyNum,
      price: priceNum,
      mode,
      product,
      status: "COMPLETE",
    });
    await newOrder.save();

    if (mode === "BUY") {
      if (entry) {
        // calculate new average properly
        const prevTotalCost = entry.avg * entry.qty;
        const newTotalQty = entry.qty + qtyNum;
        const newTotalCost = prevTotalCost + priceNum * qtyNum;
        entry.avg = newTotalCost / newTotalQty;
        entry.qty = newTotalQty;
        entry.price = priceNum;
        await entry.save();
      } else {
        const newEntry = new PositionOrHoldingModel({
          userId: req.user.id,
          name,
          qty: qtyNum,
          avg: priceNum,
          price: priceNum,
          net: "0%",
          day: "0%",
          ...(product === "MIS" ? { product: "MIS", isLoss: false } : {}),
        });
        await newEntry.save();
      }
    } else {
      // SELL — already validated above
      entry.qty -= qtyNum;
      entry.price = priceNum;

      if (entry.qty === 0) {
        await PositionOrHoldingModel.deleteOne({ _id: entry._id });
      } else {
        await entry.save();
      }
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

    // Chrome rejects SameSite=None cookies unless Secure is also set, even on
    // http://localhost — so local dev (plain HTTP) needs sameSite:"lax",
    // while the deployed Render app (cross-site HTTPS) needs sameSite:"none"+secure.
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

app.get("/me", authMiddleware, (req, res) => {
  const token = req.cookies.token;
  res.json({ user: req.user, token });
});

app.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.json({ msg: "Logged out successfully" });
});

// ---------------------- PRICE UPDATE -----------------------------------------
// This endpoint fetches a simulated price from another service (localhost:4000)
// then updates holdings with matching name (for all users that hold that name).

app.get("/getUpdatePrices", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🟢 Fetch this user's holdings (positions are handled further below —
    // don't bail out early just because holdings are empty, a user might
    // only have open intraday positions).
    const userHoldings = await HoldingsModel.find({ userId });

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
          console.log(`✅ Updated ${holding.name}: Price ${holding.price}, Net ${holding.net}, Day ${holding.day}`);
        }
      } catch (innerErr) {
        console.error(`Failed to update ${holding.name}:`, innerErr.message);
      }
    }

    // 🕒 Do the same for open intraday (MIS) positions
    const userPositions = await PositionsModel.find({ userId });
    for (const position of userPositions) {
      try {
        const { data } = await axios.get(
          `${process.env.PRICE_SERVER_URL}?stockName=${position.name}&currentPrice=${position.price}`
        );

        if (data && typeof data.price === "number") {
          const newPrice = data.price;
          const dayChange = (Math.random() - 0.5) * 3; // ±3%

          position.price = Number(newPrice.toFixed(2));
          position.day = `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`;
          position.isLoss = newPrice < position.avg;

          await position.save();
        }
      } catch (innerErr) {
        console.error(`Failed to update position ${position.name}:`, innerErr.message);
      }
    }

    // ✅ Return updated holdings only for this user
    return res.json(updatedHoldings);
  } catch (err) {
    console.error("Error updating stock prices:", err);
    return res.status(500).json({ msg: "Error updating prices" });
  }
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

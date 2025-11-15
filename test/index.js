const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps / curl / postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin), false);
    },
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  const { stockName, currentPrice } = req.query;

  // Parse currentPrice from query (default to 325 if not provided)
  const basePrice = Number(currentPrice) || 325;

  // Generate random price in range (basePrice - 25) to (basePrice + 25)
  const min = basePrice - 25;
  const max = basePrice + 25;
  let rand = Math.random() * (max - min) + min;

  // Round to 2 decimals for realism
  rand = Number(rand.toFixed(2));

  res.json({
    stockName,
    price: rand,
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

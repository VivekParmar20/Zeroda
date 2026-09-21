const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

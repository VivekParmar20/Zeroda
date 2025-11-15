const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});

module.exports = HoldingsSchema; 

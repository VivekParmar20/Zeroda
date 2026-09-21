const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const OrdersSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    product: { type: String, enum: ["CNC", "MIS"], default: "CNC" },
    status: {
      type: String,
      enum: ["COMPLETE", "REJECTED"],
      default: "COMPLETE",
    },
    rejectReason: { type: String },
  },
  { timestamps: true } //  automatically adds createdAt and updatedAt
);

module.exports = { OrdersSchema };

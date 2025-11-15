const mongoose = require("mongoose");
const HoldingsSchema = require("../schemas/HoldingsSchema");
const { model } = mongoose;

const HoldingsModel = model("Holding", HoldingsSchema); 

module.exports = {HoldingsModel}; 

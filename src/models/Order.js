
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  date: String,
  customerName: String,
  clotheType: String,
  finishingWidth: Number,
  quality: Number,
  sillName: String,
  colour: String,
  finishingType: String,
  totalGoj: Number,
  totalBundle: Number,
  dyeingName: String,
  transporterName: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

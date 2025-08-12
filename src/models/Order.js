const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    date: String,
    invoiceNumber: String, 
    companyName: String, 
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

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;

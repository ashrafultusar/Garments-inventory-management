const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, 
      default: function () {
        const year = new Date().getFullYear();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000); 
        return `#ORD-${year}-${timestamp}-${random}`;
      },
    },
    date: { type: String },
    invoiceNumber: { type: String }, 
    companyName: { type: String },
    clotheType: { type: String },
    finishingWidth: { type: Number },
    quality: { type: String },
    sillName: { type: String },
    colour: { type: String },
    finishingType: { type: String },
    totalGoj: { type: Number },
    totalBundle: { type: Number },
    dyeingName: { type: String },
    transporterName: { type: String },
  },
  { timestamps: true }
);


const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;

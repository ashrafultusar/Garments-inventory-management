const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const random = Math.floor(Math.random() * 900) + 100;

        return `#ORD-${year}-${month}${day}-${random}`;
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

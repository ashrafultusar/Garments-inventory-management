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
        return `#ord-${year}-${month}${day}-${random}`;
      }, 
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    
    status: {
      type: String,
      enum: [
        "pending",
        "batch",
        "inprocess",
        "completedprocess",
        "delivered",
        "billing",
        "completed",
      ],
      default: "pending",
    },
    date: String,
    invoiceNumber: String,
    companyName: String,
    clotheType: String,
    finishingWidth: Number,
    quality: String,
    sillName: String,
    colour: String,
    finishingType: String,
    totalGoj: Number,
    totalBundle: Number,
    dyeingName: String,
    transporterName: String,
    tableData: [
      {
        rollNo: Number,
        goj: Number,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;

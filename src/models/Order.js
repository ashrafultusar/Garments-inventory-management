
const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
   
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
         
            const year = new Date().getFullYear();
          
            const randomThreeDigitNumber = Math.floor(Math.random() * 999) + 1; 
            const formattedUniqueNum = String(randomThreeDigitNumber).padStart(3, '0'); 
            
            return `#ORD-${year}-${formattedUniqueNum}`;
        }
    },
    date: {
        type: String,
        required: true 
    },
    invoiceNumber: {
        type: String,
        required: true, // Invoice number is also crucial and should be unique
        unique: true
    },
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

// Optional: Add an index to 'orderId' for faster lookups in the database
orderSchema.index({ orderId: 1 });

// Compile the schema into a model, or use the existing one if it's already compiled
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;

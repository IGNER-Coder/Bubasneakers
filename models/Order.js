import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  // Link to the user who placed the order
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Array of items purchased (we save a snapshot of the price at purchase)
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      size: Number,
      quantity: Number,
      priceAtPurchase: Number, // Price the user actually paid
      image: String,
    }
  ],

  // Shipping & Payment Details
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },

  // Financials
  totalAmount: {
    type: Number,
    required: true,
  },
  
  // Status tracking (critical for customer service)
  status: {
    type: String,
    enum: ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  
  trackingNumber: {
    type: String,
    default: '',
  }

}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
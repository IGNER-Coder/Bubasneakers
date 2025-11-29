import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  // Link to the user (Optional for Guest Checkout)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // ⬅️ CHANGED FROM TRUE TO FALSE
  },
  
  items: [
    {
      // We store a snapshot of product details in case the product is deleted later
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      size: Number,
      quantity: Number,
      priceAtPurchase: Number,
      image: String,
    }
  ],

  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
    email: String, // Added email to shipping details
  },

  totalAmount: {
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },

  paymentMethod: {
    type: String,
    default: 'WhatsApp',
  },
  
  trackingNumber: {
    type: String,
    default: '',
  }

}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
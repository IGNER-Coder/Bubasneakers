import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  brand: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  // The "Sneaker" Superpower: Storing arrays easily
  images: [String], 
  category: { 
    type: String, // e.g. "Lifestyle", "Running"
    required: true 
  },
  gender: { 
    type: String, // "Men", "Women", "Kids"
    required: true 
  },
  // Inventory Management
  sizes: [
    {
      size: { type: Number, required: true },
      stock: { type: Number, default: 10 } // Default 10 pairs per size
    }
  ],
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent recompiling model if it already exists
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
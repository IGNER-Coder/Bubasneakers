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
  images: [String], 
  category: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    required: true 
  },
  sizes: [
    {
      size: { type: Number, required: true },
      stock: { type: Number, default: 10 }
    }
  ],
  isFeatured: {
    type: Boolean,
    default: false
  },
  // 🆕 EDITORIAL FIELDS
  storyLabel: { 
    type: String, 
    default: "Just Dropped" // e.g. "THE GRAIL", "OFF-COURT"
  },
  curatorNote: {
    type: String,
    default: "A fresh addition to the rotation." // e.g. "The silhouette that defined the 90s."
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
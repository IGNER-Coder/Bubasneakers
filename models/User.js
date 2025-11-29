import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false, 
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  image: String,
  
  // 🆕 WISHLIST FIELD
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  
  // Shipping defaults
  phone: String,
  address: String,
  city: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
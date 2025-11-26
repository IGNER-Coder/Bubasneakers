const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

// ⚠️ PASTE YOUR REAL USER ID HERE AGAIN
const ADMIN_USER_ID = "692465c39885b5056765a019E"; 

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing.");
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  images: [String],
  category: String,
  gender: String,
  sizes: [{ size: Number, stock: Number }],
  isFeatured: Boolean,
  // New fields for seed
  storyLabel: String,
  curatorNote: String
});
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ productId: mongoose.Schema.Types.ObjectId, name: String, size: Number, quantity: Number, priceAtPurchase: Number, image: String }],
    shippingAddress: { name: String, address: String, city: String, postalCode: String, phone: String },
    totalAmount: Number,
    status: { type: String, enum: ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    trackingNumber: String,
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

const products = [
  {
    name: "Air Jordan 1 'Lost & Found'",
    brand: "Nike",
    price: 180,
    description: "The classic Chicago colorway returns with a vintage aesthetic.",
    category: "Lifestyle",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000"],
    sizes: [{ size: 9, stock: 5 }, { size: 10, stock: 2 }],
    isFeatured: true,
    storyLabel: "THE HOLY GRAIL",
    curatorNote: "A reimagining of the 1985 classic. Best paired with vintage wash denim."
  },
  {
    name: "Yeezy Boost 350 V2 'Bone'",
    brand: "Adidas",
    price: 230,
    description: "Primeknit upper with translucent stripe.",
    category: "Lifestyle",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1000"],
    sizes: [{ size: 8, stock: 10 }, { size: 9, stock: 10 }],
    isFeatured: true,
    storyLabel: "MODERN COMFORT",
    curatorNote: "The definition of everyday luxury. Unmatched boost technology."
  },
  {
    name: "Air Max 90 'Infrared'",
    brand: "Nike",
    price: 130,
    description: "Clean lines, versatile and timeless.",
    category: "Running",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000"],
    sizes: [{ size: 6, stock: 5 }, { size: 7, stock: 5 }],
    isFeatured: true,
    storyLabel: "RETRO RUNNER",
    curatorNote: "The silhouette that defined a generation, now in OG form."
  },
  // ... You can keep the other non-featured products as they were
];

const orders = []; // Keep orders empty or copy your previous ones if you want history

async function seed() {
  try {
    console.log("Connecting...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    await Product.deleteMany({}); 
    // await Order.deleteMany({ userId: ADMIN_USER_ID }); // Optional: Wipe orders

    await Product.insertMany(products);
    // await Order.insertMany(orders);

    console.log("🎉 Database Updated with Editorial Data!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
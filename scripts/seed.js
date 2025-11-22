const mongoose = require("mongoose");
const path = require("path");
// Explicitly look for .env.local in the root folder
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing.");
  console.error("1. Check if '.env.local' exists in the root folder.");
  process.exit(1);
}

// Define the Schema locally
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  images: [String],
  category: String, // "Lifestyle", "Running", "Basketball", "Skate"
  gender: String,   // "Men", "Women", "Kids"
  sizes: [{ size: Number, stock: Number }],
  isFeatured: Boolean,
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// --- EXPANDED SAMPLE DATA ---
const products = [
  // --- MEN ---
  {
    name: "Air Jordan 1 'Lost & Found'",
    brand: "Nike",
    price: 180,
    description: "The classic Chicago colorway returns with a vintage aesthetic.",
    category: "Lifestyle",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000"],
    sizes: [{ size: 9, stock: 5 }, { size: 10, stock: 2 }, { size: 11, stock: 0 }],
    isFeatured: true
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
    isFeatured: true
  },
  {
    name: "Dunk Low 'Panda'",
    brand: "Nike",
    price: 110,
    description: "The shoe that needs no introduction. Black and white essential.",
    category: "Skate",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"],
    sizes: [{ size: 10, stock: 15 }],
    isFeatured: true
  },
  {
    name: "Samba OG",
    brand: "Adidas",
    price: 100,
    description: "Born on the pitch, an icon of street style.",
    category: "Lifestyle",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000"],
    sizes: [{ size: 8, stock: 8 }, { size: 9, stock: 12 }],
    isFeatured: false
  },
  {
    name: "Puma MB.01",
    brand: "Puma",
    price: 135,
    description: "LaMelo Ball's signature shoe with interdimensional style.",
    category: "Basketball",
    gender: "Men",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000"],
    sizes: [{ size: 10, stock: 4 }, { size: 11, stock: 4 }],
    isFeatured: false
  },

  // --- WOMEN ---
  {
    name: "New Balance 550",
    brand: "New Balance",
    price: 110,
    description: "Simple and clean, not overbuilt. A tribute to 90s pros.",
    category: "Lifestyle",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1539185441755-54339cf0e193?q=80&w=1000"],
    sizes: [{ size: 6, stock: 4 }, { size: 7, stock: 8 }],
    isFeatured: false
  },
  {
    name: "Air Max 90 'Infrared'",
    brand: "Nike",
    price: 130,
    description: "Clean lines, versatile and timeless. The people's shoe.",
    category: "Running",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000"],
    sizes: [{ size: 6, stock: 5 }, { size: 7, stock: 5 }, { size: 8, stock: 5 }],
    isFeatured: true
  },
  {
    name: "Gel-Kayano 14",
    brand: "Asics",
    price: 160,
    description: "Late 2000s aesthetic with modern performance.",
    category: "Running",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000"], 
    sizes: [{ size: 7, stock: 3 }, { size: 8, stock: 2 }],
    isFeatured: false
  },

  // --- KIDS ---
  {
    name: "Old Skool V",
    brand: "Vans",
    price: 45,
    description: "The classic side stripe with velcro for easy on/off.",
    category: "Skate",
    gender: "Kids",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000"],
    sizes: [{ size: 11, stock: 10 }, { size: 12, stock: 10 }, { size: 13, stock: 10 }],
    isFeatured: false
  },
  {
    name: "Air Force 1 LE",
    brand: "Nike",
    price: 90,
    description: "The legend lives on in the Air Force 1, offering classic style.",
    category: "Lifestyle",
    gender: "Kids",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"], 
    sizes: [{ size: 1, stock: 5 }, { size: 2, stock: 5 }],
    isFeatured: false
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to Atlas!");

    console.log("Cleaning old data...");
    await Product.deleteMany({}); 

    console.log("🌱 Planting new seeds...");
    await Product.insertMany(products);

    console.log("🎉 Database Populated Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Connection Error:", error.message);
    process.exit(1);
  }
}

seed();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing.");
  process.exit(1);
}

// Minimal Schema definition for deletion
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function clean() {
  try {
    console.log("🗑️  Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    console.log("🧹 Wiping ALL Products...");
    const result = await Product.deleteMany({});

    console.log(`✨ Success! Deleted ${result.deletedCount} products.`);
    console.log("🎉 The database is empty. Ready for CSV Import.");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    process.exit(1);
  }
}

clean();
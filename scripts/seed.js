const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing.");
  process.exit(1);
}

// --- UPDATED SCHEMA (With Colors & Multi-Image Support) ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  gender: { type: String, required: true },
  description: { type: String, required: true },
  
  // 📸 IMAGES: 
  // Index 0 = Main Card Image
  // Index 1 = Hover Image (on Grid)
  // Index 2, 3... = Gallery Images (on Product Page)
  images: [String], 
  
  // 🎨 COLORS: Array of available colors for this specific drop
  colors: [String], 

  sizes: [
    {
      size: { type: Number },
      stock: { type: Number, default: 10 }
    }
  ],
  isFeatured: { type: Boolean, default: false },
  storyLabel: String,
  curatorNote: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// -----------------------------------------------------------------------------
// 👟 REAL INVENTORY TEMPLATES
// -----------------------------------------------------------------------------
const products = [
    // ============================ WOMEN'S HEAT (REAL IMAGES) ============================
  {
    name: "Air Jordan 1 High OG 'Satin Bred' WMNS",
    brand: "Jordan",
    price: 23800,
    category: "Lifestyle",
    gender: "Women",
    description: "Women's exclusive satin take on the iconic Bred 1. Glossy satin panels replace traditional leather for a luxurious twist on the classic.",
    colors: ["Black", "Varsity Red", "Satin"],
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Satin-Bred-WMNS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Satin-Bred-WMNS-Product-2.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Satin-Bred-WMNS-Product-3.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 36, stock: 8 }, { size: 37, stock: 12 }, { size: 38, stock: 15 },
      { size: 39, stock: 10 }, { size: 40, stock: 7 }
    ],
    isFeatured: true,
    storyLabel: "SATIN QUEEN",
    curatorNote: "The women’s exclusive that made everyone jealous."
  },
  {
    name: "Nike Dunk Low 'Rose Whisper' WMNS",
    brand: "Nike",
    price: 14800,
    category: "Lifestyle",
    gender: "Women",
    description: "Soft white leather base with delicate Rose Whisper pink overlays. The perfect feminine touch on the classic Dunk silhouette.",
    colors: ["White", "Rose Whisper"],
    images: [
      "https://images.stockx.com/images/Nike-Dunk-Low-Rose-Whisper-W.png?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Nike-Dunk-Low-Rose-Whisper-W-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Nike-Dunk-Low-Rose-Whisper-W-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 36, stock: 25 }, { size: 37, stock: 30 }, { size: 38, stock: 28 },
      { size: 39, stock: 20 }, { size: 40, stock: 15 }
    ],
    isFeatured: true,
    storyLabel: "SPRING VIBES",
    curatorNote: "The softest Dunk Low you’ll ever own."
  },
  {
    name: "adidas Samba 'Silver Dawn' WMNS",
    brand: "adidas",
    price: 15800,
    category: "Lifestyle",
    gender: "Women",
    description: "Women’s-exclusive metallic silver Samba with cream leather base and light gum sole.",
    colors: ["Silver Dawn", "Cream White", "Gum"],
    images: [
      "https://images.stockx.com/images/adidas-Samba-OG-Silver-Dawn-WMNS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/adidas-Samba-OG-Silver-Dawn-WMNS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 36, stock: 20 }, { size: 37, stock: 25 }, { size: 38, stock: 22 },
      { size: 39, stock: 18 }
    ],
    isFeatured: false,
    storyLabel: "METALLIC TERRACE",
    curatorNote: "The Samba every influencer is wearing in 2025."
  },
  {
    name: "New Balance 550 'Sea Salt Pink' WMNS",
    brand: "New Balance",
    price: 15800,
    category: "Lifestyle",
    gender: "Women",
    description: "Women’s sizing with soft pink accents on the classic 550 platform.",
    colors: ["Sea Salt", "Macaron Pink", "White"],
    images: [
      "https://images.stockx.com/images/New-Balance-550-Sea-Salt-Pink-WMNS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/New-Balance-550-Sea-Salt-Pink-WMNS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 36, stock: 18 }, { size: 37, stock: 22 }, { size: 38, stock: 25 },
      { size: 39, stock: 15 }
    ],
    isFeatured: true,
    storyLabel: "PASTEL PERFECTION",
    curatorNote: "550s, but make them cute."
  },
  {
    name: "Air Jordan 4 'Frozen Moments' WMNS",
    brand: "Jordan",
    price: 29800,
    category: "Lifestyle",
    gender: "Women",
    description: "Light grey suede upper with metallic silver accents and icy translucent outsole.",
    colors: ["Light Iron Ore", "Sail", "Metallic Silver"],
    images: [
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Frozen-Moments-W.png?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Frozen-Moments-W-Product-2.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Frozen-Moments-W-Product-3.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 37, stock: 6 }, { size: 38, stock: 10 }, { size: 39, stock: 8 },
      { size: 40, stock: 5 }
    ],
    isFeatured: true,
    storyLabel: "WOMEN'S GRAIL",
    curatorNote: "Grey suede 4s exclusively for the ladies. Instant sell-out energy."
  },

  // =============================== KIDS (GS) REAL IMAGES ===============================
  {
    name: "Air Jordan 1 High OG 'Spider-Man: Across the Spider-Verse' (GS)",
    brand: "Jordan",
    price: 16800,
    category: "Lifestyle",
    gender: "Kids",
    description: "Grade-school exclusive with Chicago-inspired color blocking and special Spider-Man packaging.",
    colors: ["Gym Red", "Black", "White"],
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Spider-Man-Across-the-Spider-Verse-GS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Spider-Man-Across-the-Spider-Verse-GS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 35, stock: 10 }, { size: 36, stock: 12 }, { size: 37, stock: 15 },
      { size: 38, stock: 12 }, { size: 39, stock: 8 }
    ],
    isFeatured: true,
    storyLabel: "SPIDER KIDS",
    curatorNote: "The GS drop every parent fought for."
  },
  {
    name: "Nike Dunk Low 'Panda' (GS)",
    brand: "Nike",
    price: 9800,
    category: "Lifestyle",
    gender: "Kids",
    description: "The exact same Panda colorway as the adults, but sized for kids.",
    colors: ["Black", "White"],
    images: [
      "https://images.stockx.com/images/Nike-Dunk-Low-White-Black-2021-GS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Nike-Dunk-Low-White-Black-2021-GS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 32, stock: 20 }, { size: 33, stock: 25 }, { size: 34, stock: 30 },
      { size: 35, stock: 28 }, { size: 36, stock: 20 }
    ],
    isFeatured: true,
    storyLabel: "MINI PANDA",
    curatorNote: "Because even kids deserve the classics."
  },
  {
    name: "Air Jordan 4 'Military Black' (GS)",
    brand: "Jordan",
    price: 15800,
    category: "Lifestyle",
    gender: "Kids",
    description: "Exact replica of the adult Military Black 4 in grade-school sizing.",
    colors: ["White", "Black", "Neutral Grey"],
    images: [
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Military-Black-GS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Military-Black-GS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 35, stock: 15 }, { size: 36, stock: 18 }, { size: 37, stock: 20 },
      { size: 38, stock: 16 }, { size: 39, stock: 12 }
    ],
    isFeatured: false,
    storyLabel: "FUTURE GRAIL",
    curatorNote: "Let the kids flex too."
  },
  {
    name: "adidas Samba OG 'White Green' (GS)",
    brand: "adidas",
    price: 9800,
    category: "Lifestyle",
    gender: "Kids",
    description: "Mini version of the world’s hottest shoe in kids sizing.",
    colors: ["Cloud White", "Green", "Gum"],
    images: [
      "https://images.stockx.com/images/adidas-Samba-OG-White-Green-GS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/adidas-Samba-OG-White-Green-GS-2.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 30, stock: 18 }, { size: 32, stock: 22 }, { size: 34, stock: 25 },
      { size: 35, stock: 20 }, { size: 36, stock: 15 }
    ],
    isFeatured: false,
    storyLabel: "MINI TERRACE",
    curatorNote: "The coolest kids on the block start early."
  },
  {
    name: "Travis Scott x Air Jordan 1 Low 'Mocha' (GS)",
    brand: "Jordan",
    price: 39800,
    category: "Lifestyle",
    gender: "Kids",
    description: "Grade-school version of the legendary Travis Scott Mocha 1 Low with reverse Swoosh.",
    colors: ["Black", "Dark Mocha", "Sail"],
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Low-Travis-Scott-Reverse-Mocha-GS-Product.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-1-Low-Travis-Scott-Reverse-Mocha-GS-2.jpg?fit=fill&w=1080&h=1080",
      "https://images.stockx.com/images/Air-Jordan-1-Low-Travis-Scott-Reverse-Mocha-GS-3.jpg?fit=fill&w=1080&h=1080"
    ],
    sizes: [
      { size: 35, stock: 3 }, { size: 36, stock: 5 }, { size: 37, stock: 6 },
      { size: 38, stock: 4 }, { size: 39, stock: 2 }
    ],
    isFeatured: true,
    storyLabel: "KID CACTUS",
    curatorNote: "The most expensive kids shoe you’ll ever buy — and worth every shilling."
  },
  {
    name: "Air Jordan 4 'Military Black'",
    brand: "Jordan",
    price: 18500, 
    category: "Lifestyle",
    gender: "Men",
    description: "The Air Jordan 4 Retro 'Military Black' showcases the same color blocking and materials featured on the OG 'Military Blue' colorway from 1989. Smooth white leather is utilized on the upper, bolstered with a forefoot overlay in grey suede.",
    colors: ["White", "Black", "Neutral Grey"], // 🎨 The Colorway
    images: [
      // 1. FRONT (Cover)
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000", 
      // 2. SIDE/HOVER
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000",
      // 3. BACK/DETAIL
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000",
      // 4. ON FOOT
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 5 }, { size: 41, stock: 5 }, { size: 42, stock: 5 }, 
      { size: 43, stock: 5 }, { size: 44, stock: 5 }
    ],
    isFeatured: true,
    storyLabel: "THE GRAIL",
    curatorNote: "A masterclass in neutral color blocking. Essential for any rotation."
  },
  {
    name: "Yeezy Boost 350 V2 'Bone'",
    brand: "Yeezy",
    price: 16000,
    category: "Lifestyle",
    gender: "Men",
    description: "The adidas Yeezy Boost 350 V2 Bone features a triple white Primeknit upper with mesh side stripes and canvas heel tabs.",
    colors: ["Bone", "Pure White"],
    images: [
      "https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1000",
      "https://images.unsplash.com/photo-1539185441755-54339cf0e193?q=80&w=1000",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000"
    ],
    sizes: [{ size: 40, stock: 10 }, { size: 41, stock: 10 }, { size: 42, stock: 8 }],
    isFeatured: true,
    storyLabel: "PURE COMFORT",
    curatorNote: "Clean, minimal, and incredibly comfortable."
  },
  {
    name: "New Balance 9060 'Rain Cloud'",
    brand: "New Balance",
    price: 14500,
    category: "Lifestyle",
    gender: "Unisex",
    description: "The New Balance 9060 reinterprets familiar elements from the classic 99X models with a warped sensibility inspired by the proudly futuristic, visible tech aesthetic of the Y2K era.",
    colors: ["Grey", "Rain Cloud", "Castlerock"],
    images: [
      "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=1000",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000"
    ],
    sizes: [{ size: 38, stock: 5 }, { size: 39, stock: 5 }, { size: 40, stock: 5 }],
    isFeatured: true,
    storyLabel: "NEW CLASSIC",
    curatorNote: "The perfect dad shoe evolved for the modern era."
  },
    // ============================ PREMIUM 2025 DROPS ============================
  {
    name: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha'",
    brand: "Jordan",
    price: 48500,
    category: "Lifestyle",
    gender: "Men",
    description: "The most hyped Travis drop of the decade. Oversized reversed Sail Swooshes on a rich dark mocha tumbled leather base with Cactus Jack branding throughout.",
    colors: ["Dark Mocha", "Sail", "University Red"],
    images: [
      "https://images.unsplash.com/photo-1629244927232-4f5f93f1d0c8?q=80&w=1000",
      "https://images.unsplash.com/photo-1600269457121-431154f7a8a8?q=80&w=1000",
      "https://images.unsplash.com/photo-1631980357101-0f0d908c9810?q=80&w=1000",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 2 }, { size: 41, stock: 4 }, { size: 42, stock: 6 },
      { size: 43, stock: 5 }, { size: 44, stock: 3 }, { size: 45, stock: 1 }
    ],
    isFeatured: true,
    storyLabel: "REVERSE GRAIL",
    curatorNote: "The backwards Swoosh that broke the internet — again."
  },
  {
    name: "Nike SB Dunk Low 'Jarritos'",
    brand: "Nike SB",
    price: 32800,
    category: "Skate",
    gender: "Men",
    description: "Tear-away canvas reveals hidden Jarritos branding underneath. Orange, green and white colorway inspired by Mexico’s favorite soda.",
    colors: ["Phantom", "Safety Orange", "Malachite"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
      "https://images.unsplash.com/photo-1621112883753-5155e3c47884?q=80&w=1000",
      "https://images.unsplash.com/photo-1544441893-2e0513e5e5e3?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 7 }, { size: 41, stock: 8 }, { size: 42, stock: 10 },
      { size: 43, stock: 6 }, { size: 44, stock: 5 }
    ],
    isFeatured: true,
    storyLabel: "TEAR-AWAY KING",
    curatorNote: "The collab that made everyone thirsty."
  },
  {
    name: "Air Jordan 4 'Bred Reimagined'",
    brand: "Jordan",
    price: 25800,
    category: "Lifestyle",
    gender: "Men",
    description: "35th anniversary edition with premium full-grain leather instead of nubuck. Classic black, cement grey and fire red — elevated.",
    colors: ["Black", "Cement Grey", "Fire Red"],
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000",
      "https://images.unsplash.com/photo-1631980357101-0f0d908c9810?q=80&w=1000",
      "https://images.unsplash.com/photo-1600269457121-431154f7a8a8?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 15 }, { size: 41, stock: 12 }, { size: 42, stock: 18 },
      { size: 43, stock: 14 }, { size: 44, stock: 10 }, { size: 45, stock: 6 }
    ],
    isFeatured: false,
    storyLabel: "BRED 4 LEATHER",
    curatorNote: "The Bred you always wanted — now in luxury leather."
  },
  {
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    price: 14800,
    category: "Lifestyle",
    gender: "Unisex",
    description: "The silhouette that revived New Balance. Clean white leather with forest green accents and that perfect retro basketball shape.",
    colors: ["White", "Green", "Grey"],
    images: [
      "https://images.unsplash.com/photo-1595959791935-850c6245c48c?q=80&w=1000",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000",
      "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=1000"
    ],
    sizes: [
      { size: 38, stock: 20 }, { size: 39, stock: 18 }, { size: 40, stock: 25 },
      { size: 41, stock: 22 }, { size: 42, stock: 20 }, { size: 43, stock: 15 }
    ],
    isFeatured: true,
    storyLabel: "DAD SHOE ROYALTY",
    curatorNote: "Proof that simplicity wins every time."
  },
  {
    name: "adidas Samba OG 'Cloud White/Core Black'",
    brand: "adidas",
    price: 13800,
    category: "Lifestyle",
    gender: "Unisex",
    description: "The terrace legend that became a global fashion staple. Premium leather, suede T-toe, and iconic gum sole.",
    colors: ["Cloud White", "Core Black", "Gum"],
    images: [
      "https://images.unsplash.com/photo-1606107557195-9325a3b7a3e5?q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"
    ],
    sizes: [
      { size: 38, stock: 25 }, { size: 39, stock: 30 }, { size: 40, stock: 28 },
      { size: 41, stock: 25 }, { size: 42, stock: 20 }
    ],
    isFeatured: false,
    storyLabel: "TERRACE CLASSIC",
    curatorNote: "Still undefeated in 2025."
  },
  {
    name: "Air Jordan 1 High 'Chicago Lost & Found'",
    brand: "Jordan",
    price: 42800,
    category: "Lifestyle",
    gender: "Men",
    description: "Vintage-inspired reissue with pre-distressed leather, yellowed midsoles and 'attic-found' packaging.",
    colors: ["Varsity Red", "Black", "Sail", "Muslin"],
    images: [
      "https://images.unsplash.com/photo-1631980357101-0f0d908c9810?q=80&w=1000",
      "https://images.unsplash.com/photo-1600269457121-431154f7a8a8?q=80&w=1000",
      "https://images.unsplash.com/photo-1629244927232-4f5f93f1d0c8?q=80&w=1000"
    ],
    sizes: [
      { size: 41, stock: 2 }, { size: 42, stock: 5 }, { size: 43, stock: 4 },
      { size: 44, stock: 3 }, { size: 45, stock: 1 }
    ],
    isFeatured: true,
    storyLabel: "1985 REBORN",
    curatorNote: "Closest you’ll ever get to a true ‘85 Chicago."
  },
  {
    name: "Asics Gel-Kayano 14 'White Sage'",
    brand: "Asics",
    price: 16800,
    category: "Running",
    gender: "Unisex",
    description: "The 2000s stability runner that became a streetwear icon. Mesh and leather overlay with subtle sage green hits.",
    colors: ["White", "Sage", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc1dcb2af73?q=80&w=1000",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 15 }, { size: 41, stock: 18 }, { size: 42, stock: 20 },
      { size: 43, stock: 14 }, { size: 44, stock: 10 }
    ],
    isFeatured: false,
    storyLabel: "TECH-RUNNER WAVE",
    curatorNote: "Performance meets fashion — perfectly balanced."
  },
  {
    name: "Nike Dunk Low 'Panda'",
    brand: "Nike",
    price: 12800,
    category: "Lifestyle",
    gender: "Women",
    description: "The black-and-white phenomenon that refuses to die. Clean, timeless, and goes with everything.",
    colors: ["Black", "White"],
    images: [
      "https://images.unsplash.com/photo-1620917662482-9d2e2a4e8c2f?q=80&w=1000",
      "https://images.unsplash.com/photo-1606107557195-9325a3b7a3e5?q=80&w=1000",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000"
    ],
    sizes: [
      { size: 36, stock: 30 }, { size: 37, stock: 35 }, { size: 38, stock: 32 },
      { size: 39, stock: 25 }, { size: 40, stock: 20 }
    ],
    isFeatured: true,
    storyLabel: "EVERYDAY PANDA",
    curatorNote: "The people’s champ — still moving units like crazy."
  },
  {
    name: "Salomon XT-6 'Vanilla Ice'",
    brand: "Salomon",
    price: 24800,
    category: "Lifestyle",
    gender: "Men",
    description: "Gorpcore royalty in a creamy vanilla colorway. Quicklace system and aggressive trail sole.",
    colors: ["Vanilla Ice", "Almond Milk", "Lunar Rock"],
    images: [
      "https://images.unsplash.com/photo-1666789498868-6a8367e4a04d?q=80&w=1000",
      "https://images.unsplash.com/photo-1620799140408-edc1dcb2af73?q=80&w=1000"
    ],
    sizes: [
      { size: 41, stock: 10 }, { size: 42, stock: 14 }, { size: 43, stock: 12 },
      { size: 44, stock: 10 }, { size: 45, stock: 7 }
    ],
    isFeatured: false,
    storyLabel: "GORPCORE SZN",
    curatorNote: "Trail performance turned high fashion."
  },
  {
    name: "Off-White x Air Jordan 2 Low 'Black Royal'",
    brand: "Jordan",
    price: 36800,
    category: "Lifestyle",
    gender: "Men",
    description: "Virgil’s final Jordan 2 tribute. Crumbling midsole, exposed foam, signature zip tie and MJ’s signature on the side.",
    colors: ["Black", "Varsity Royal", "Blue"],
    images: [
      "https://images.unsplash.com/photo-1640636201295-4c37311a8e2e?q=80&w=1000",
      "https://images.unsplash.com/photo-1600269457121-431154f7a8a8?q=80&w=1000"
    ],
    sizes: [
      { size: 41, stock: 3 }, { size: 42, stock: 5 }, { size: 43, stock: 4 },
      { size: 44, stock: 2 }
    ],
    isFeatured: true,
    storyLabel: "VIRGIL FOREVER",
    curatorNote: "Rest in Peace to the goat. One of his last masterpieces."
  },
  {
    name: "Bad Bunny x adidas Campus 'Deep Brown'",
    brand: "adidas",
    price: 21800,
    category: "Lifestyle",
    gender: "Unisex",
    description: "Benito’s signature chunky Campus with premium suede, extra padding and co-branded details throughout.",
    colors: ["Deep Brown", "Chalk White", "Cream"],
    images: [
      "https://images.unsplash.com/photo-1606107557195-9325a3b7a3e5?q=80&w=1000",
      "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=1000"
    ],
    sizes: [
      { size: 39, stock: 12 }, { size: 40, stock: 15 }, { size: 41, stock: 14 },
      { size: 42, stock: 10 }, { size: 43, stock: 8 }
    ],
    isFeatured: true,
    storyLabel: "BENITO EFFECT",
    curatorNote: "Bad Bunny doing what he does best — selling out instantly."
  },
  {
    name: "Hoka Tor Ultra Low 'Black'",
    brand: "Hoka",
    price: 19800,
    category: "Lifestyle",
    gender: "Unisex",
    description: "Maximum cushioning meets rugged trail aesthetics. Vibram megagrip sole and eVent waterproof bootie construction.",
    colors: ["Black", "Castlerock"],
    images: [
      "https://images.unsplash.com/photo-1666789498868-6a8367e4a04d?q=80&w=1000"
    ],
    sizes: [
      { size: 40, stock: 10 }, { size: 41, stock: 12 }, { size: 42, stock: 15 },
      { size: 43, stock: 10 }, { size: 44, stock: 8 }
    ],
    isFeatured: false,
    storyLabel: "MAX CUSHION ERA",
    curatorNote: "Cloud-walking technology you can actually style."
  }
  // =====================================================================
  
  
];

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    console.log("🧹 Clearing existing products...");
    await Product.deleteMany({}); 

    console.log(`🌱 Planting ${products.length} products with full galleries...`);
    await Product.insertMany(products);

    console.log("🎉 Database successfully updated!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
}

seed();
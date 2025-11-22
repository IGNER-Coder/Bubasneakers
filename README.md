BUBASNEAKERS.

Run The Streets.
A premium, mobile-first e-commerce experience for sneaker enthusiasts.

🚀 About The Project

BUBASNEAKERS is a "Street-Luxe" e-commerce platform designed to bridge the gap between high-fashion aesthetics and functional retail. Unlike standard templates, this project features a custom-built UI/UX focused on product discovery and conversion.

Currently in Phase 1 (MVP), the application handles the full customer journey from the Landing Page to Checkout using client-side logic and persistent state management.

✨ Key Features

Street-Luxe UI System: A custom design system using Oswald (Headings) and Inter (Body) fonts with a monochrome + Electric Blue palette.

Smart Cart Logic: * Handles composite keys (Same product, different sizes are treated as unique items).

Persists data via localStorage so users don't lose their cart on refresh.

Real-time total calculation and quantity management.

Dynamic Product Pages: One template (/product/[slug]) handles all SKU variations with sticky details and responsive image galleries.

Distraction-Free Checkout: A dedicated route that removes global navigation to increase conversion focus.

Advanced Filtering: Shop page with Sidebar (Desktop) and Slide-over Drawer (Mobile) filtering logic.

🛠️ Tech Stack

Framework: Next.js 14 (App Router)

Styling: Tailwind CSS (Utility-first)

Icons: Lucide React

State Management: React Context API (CartContext)

Deployment: Vercel

📂 Project Structure

bubasneakers/
├── app/
│   ├── checkout/      # Distraction-free payment page
│   ├── product/       # Dynamic product details ([slug])
│   ├── shop/          # Collection page with filters
│   ├── layout.js      # Global font & context wrappers
│   └── page.js        # Homepage (Hero & Drops)
├── components/
│   ├── CartDrawer.jsx # Slide-out shopping cart
│   ├── Navbar.jsx     # Responsive navigation
│   └── ProductCard.jsx# Reusable product component
├── context/
│   └── CartContext.js # Global state (Add/Remove/Update logic)
└── public/            # Static assets


⚡ Getting Started

Clone the repository and install dependencies to run the storefront locally.

# 1. Clone the repo
git clone [https://github.com/YOUR_USERNAME/bubasneakers.git](https://github.com/YOUR_USERNAME/bubasneakers.git)

# 2. Enter the directory
cd bubasneakers

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev


Open http://localhost:3000 with your browser to see the result.

🗺️ Roadmap

This project is being developed using Agile methodology.

[x] Phase 1: Storefront MVP (Home, Shop, Product, Cart, Checkout UI)

[ ] Phase 2: Backend Integration (MongoDB Atlas Connection, Mongoose Schemas)

[ ] Phase 3: Authentication (NextAuth.js for User Accounts)

[ ] Phase 4: Payments (Stripe & M-Pesa API Integration)

[ ] Phase 5: Admin Dashboard (CMS for managing drops)

🤝 Contributing

Contributions are welcome! Please check the Issues tab to see what is currently being worked on.

📄 License

Distributed under the MIT License. See LICENSE for more information.

Built by [Your Name]
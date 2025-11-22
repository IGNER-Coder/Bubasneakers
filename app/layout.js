import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'; // Import the Navbar component
import { CartProvider } from "../context/CartContext"; // Import CartProvider
import CartDrawer from "../components/CartDrawer"; // Import CartDrawer

// 1. Configure Body Font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", 
});

// 2. Configure Heading Font
const oswald = Oswald({ 
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap", 
});

export const metadata = {
  title: "BUBASNEAKERS | Run The Streets",
  description: "Premium streetwear and sneakers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <CartProvider>
          <Navbar /> {/* Render the Navbar component here */}
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <CartDrawer /> {/* Render the CartDrawer component here */}
        </CartProvider>
      </body>
    </html>
  );
}
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // The wrapper we just made

import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

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
  title: {
    template: '%s | BUBASNEAKERS',
    default: 'BUBASNEAKERS | Premium Streetwear & Footwear',
  },
  description: 'The destination for authentic Jordan, Yeezy, and Nike sneakers in Nairobi.',
  icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${oswald.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Wrap the whole app in the Client Providers */}
        <Providers>
          <div className="min-h-screen flex flex-col">
           
            <CartDrawer />
            
            {/* Main Content grows to fill space */}
            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
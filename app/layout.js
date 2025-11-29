import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { Suspense } from "react"; 

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", 
});

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
        <Providers>
          <div className="min-h-screen flex flex-col">
            
            {/* --- NAVBAR SECTION --- */}
            {/* Removed visual fallback to prevent "Double Navbar" glitch during hydration */}
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            {/* ---------------------- */}

            <Suspense fallback={null}>
              <CartDrawer />
            </Suspense>
            
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
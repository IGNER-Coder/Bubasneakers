import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import { Suspense } from "react";
import { MessageCircle } from "lucide-react";
import Script from "next/script";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.bubasneakers.com"),
  title: {
    template: "%s | BUBASNEAKERS",
    default: "BUBASNEAKERS | Premium Streetwear & Footwear — Nairobi",
  },
  description:
    "Authenticated Jordans, Nikes, Adidas & more. A premium sneaker boutique based in Kenya, delivering across Nairobi in 24hrs and nationwide.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BUBASNEAKERS | Premium Streetwear & Footwear — Nairobi",
    description: "Authenticated Jordans, Nikes, Adidas & more. A premium sneaker boutique based in Kenya, delivering across Nairobi in 24hrs and nationwide.",
    url: "/",
    siteName: "BUBASNEAKERS",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUBASNEAKERS | Premium Streetwear & Footwear",
    description: "Authenticated Jordans, Nikes, Adidas & more. A premium sneaker boutique based in Kenya.",
  },
};

const WHATSAPP_URL = `https://wa.me/254797533977?text=${encodeURIComponent(
  "Hi BubaSneakers! I'd like to place an order."
)}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Meta Pixel Placeholder */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID_HERE'); /* Replace with your ID */
            fbq('track', 'PageView');
          `}
        </Script>

        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>

            {/* Cart Drawer */}
            <Suspense fallback={null}>
              <CartDrawer />
            </Suspense>

            {/* Page Content */}
            <main className="flex-1 pb-16 md:pb-0">{children}</main>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>

            {/* Floating WhatsApp Button (Desktop only — mobile uses bottom nav) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden md:flex fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full items-center justify-center shadow-2xl shadow-green-900/30 hover:scale-110 hover:bg-green-500 transition-all duration-300 group"
            >
              <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
              {/* Tooltip */}
              <span className="absolute right-16 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
              </span>
            </a>
          </div>
        </Providers>
      </body>
    </html>
  );
}
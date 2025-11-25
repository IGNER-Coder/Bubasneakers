import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Import the Providers wrapper component

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
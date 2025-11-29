import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product"; // Necessary for population
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";

async function getUserWishlist(email) {
  await connectToDatabase();
  
  // Find user and populate the wishlist array with real product data
  const user = await User.findOne({ email }).populate('wishlist').lean();
  
  if (!user || !user.wishlist) return [];

  // Clean up data for Next.js
  return user.wishlist.map(p => ({
    id: p._id.toString(),
    name: p.name,
    brand: p.brand,
    price: p.price,
    image: p.images?.[0] || '', 
    soldOut: false,
    isFeatured: p.isFeatured
  }));
}

export default async function WishlistPage() {
  // 1. Get Session
  // MOCK for Preview: 
  // const session = { user: { email: "test@gmail.com" } };
  
  // PROD: Uncomment this!
  // const session = await getServerSession(authOptions); 

  // Since I can't import authOptions easily here without your file structure, 
  // We will rely on the client-side redirect if session is missing, 
  // OR you can assume the user is 'test@gmail.com' for this test.
  
  // LET'S USE A MOCK TO MAKE IT WORK NOW:
  const session = { user: { email: "test@gmail.com" } }; 

  if (!session) {
    redirect("/login");
  }

  const wishlistItems = await getUserWishlist(session.user.email);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
            <h1 className="font-oswald text-4xl md:text-6xl font-bold uppercase mb-4 flex items-center justify-center gap-3">
               <Heart className="w-8 h-8 md:w-12 md:h-12 text-red-500 fill-current" /> My Wishlist
            </h1>
            <p className="text-concrete">Your curated collection of favorites.</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl">
            <p className="text-xl text-concrete font-medium mb-6">Your wishlist is empty.</p>
            <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-colors shadow-lg">
              Explore The Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
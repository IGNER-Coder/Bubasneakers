import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import EditorialGrid from "../components/EditorialGrid";
import MacroTexture from "../components/MacroTexture";
import TrustBar from "../components/TrustBar";
import WhatsAppCTA from "../components/WhatsAppCTA";
import connectToDatabase from "../lib/db";
import Product from "../models/Product";

async function getProducts() {
  try {
    await connectToDatabase();
    const products = await Product.find({ isFeatured: true }).limit(4).lean();

    return products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.images && p.images.length > 0 ? p.images[0] : "",
      images: p.images || [],
      soldOut: p.sizes && p.sizes.length > 0 ? p.sizes.reduce((sum, s) => sum + s.stock, 0) === 0 : true,
      storyLabel: p.storyLabel || "Just Dropped",
      curatorNote: p.curatorNote || "A Buba Sneakers exclusive.",
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="animate-fade-in">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Editorial / Categories */}
      <MacroTexture />
      <EditorialGrid />

      {/* 4. This Week's Edit — Featured Products */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <span className="text-electric-blue text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Editor's Pick
          </span>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase mb-3">
            This Week's Edit
          </h2>
          <p className="text-concrete text-sm md:text-base">
            Hand-picked from the shop. Limited availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="flex flex-col gap-4 group">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-blue border-l-2 border-electric-blue pl-2">
                  {product.storyLabel}
                </span>

                <ProductCard product={product} />

                <div className="pt-2 border-t border-neutral-100 mt-2">
                  <p className="text-sm text-concrete font-serif italic leading-relaxed">
                    &ldquo;{product.curatorNote}&rdquo;
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-concrete py-12">
              New collection coming soon. WhatsApp us to find out what&apos;s in stock.
            </p>
          )}
        </div>
      </section>

      {/* 5. WhatsApp CTA — Final conversion point */}
      <WhatsAppCTA />
    </main>
  );
}
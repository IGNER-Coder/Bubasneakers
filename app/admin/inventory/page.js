"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Loader2, ArrowLeft } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Products
  const fetchProducts = async () => {
    try {
      // We can reuse the public search API to get everything, or make a dedicated admin one.
      // For now, let's use the search API with a generic query or just fetch from a new endpoint.
      // Since we didn't make a "GET ALL" admin route, we'll simulate it or use the Shop page logic.
      // Ideally: Create GET /api/admin/products
      
      // Temporary: Fetching via the public search API trick (empty query returns all in some setups)
      // Better: Let's just fetch from the shop page endpoint if accessible, or create a quick fetch here.
      // PRO FIX: We will use the public shop page data fetching strategy but client side.
      // ACTUALLY: Let's just add a GET handler to the /api/admin/products/route.js in the next step.
      
      // Assuming we add GET to /api/admin/products:
      const res = await fetch('/api/admin/products'); 
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from UI immediately
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-off-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/admin" className="text-concrete hover:text-black flex items-center gap-1 text-sm font-bold mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="font-oswald text-4xl font-bold uppercase">Inventory</h1>
          </div>
          <Link href="/admin/add">
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-electric-blue transition-colors shadow-lg">
                <Plus className="w-5 h-5" /> Add Product
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-100">
            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : products.length === 0 ? (
                <div className="p-12 text-center text-concrete">No products found. Start selling!</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-concrete uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-concrete uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-concrete uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-concrete uppercase tracking-wider">Stock Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-concrete uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                                                <img src={product.images?.[0]} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-black">{product.name}</div>
                                                <div className="text-xs text-concrete">{product.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-concrete">
                                        <span className="capitalize">{product.category}</span> / {product.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                                            In Stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit Button (Placeholder for now) */}
                                            <Link href={`/admin/edit/${product._id}`}>
    <button className="p-2 text-concrete hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
        <Edit className="w-4 h-4" />
    </button>
</Link>
                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
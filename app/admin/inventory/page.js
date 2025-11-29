"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, ShoppingBag, Truck, Loader2, RefreshCw, LayoutDashboard, FileSpreadsheet, Edit, Trash2, Plus, ArrowLeft, Star } from "lucide-react";

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null); // To show spinner on star click

  // 1. SECURITY
  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") redirect("/");
  }, [status, session]);

  // 2. FETCH
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // We reuse the same GET endpoint
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
    if (session?.user?.role === "admin") fetchProducts();
  }, [session]);

  // 3. DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  // 4. 🆕 TOGGLE FEATURED (HOMEPAGE)
  const toggleFeatured = async (product) => {
    setTogglingId(product._id);
    const newStatus = !product.isFeatured;

    try {
        const res = await fetch(`/api/admin/products/${product._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFeatured: newStatus })
        });

        if (res.ok) {
            // Optimistic Update
            setProducts(prev => prev.map(p => 
                p._id === product._id ? { ...p, isFeatured: newStatus } : p
            ));
        }
    } catch (error) {
        console.error("Toggle failed", error);
    } finally {
        setTogglingId(null);
    }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

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
          
          <div className="flex gap-3">
             <Link href="/admin/import">
                <button className="bg-white text-black border border-neutral-200 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                    <FileSpreadsheet className="w-5 h-5" /> Bulk Import
                </button>
             </Link>
             <Link href="/admin/add">
                <button className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-electric-blue transition-colors shadow-lg">
                    <Plus className="w-5 h-5" /> Add Product
                </button>
             </Link>
          </div>
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
                                <th className="px-6 py-4 text-center text-xs font-bold text-concrete uppercase tracking-wider">Homepage?</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-concrete uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                                <img src={product.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-black truncate max-w-[200px]">{product.name}</div>
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
                                    
                                    {/* 🌟 FEATURE TOGGLE */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button 
                                            onClick={() => toggleFeatured(product)}
                                            disabled={togglingId === product._id}
                                            className="p-2 hover:bg-neutral-100 rounded-full transition"
                                            title={product.isFeatured ? "Remove from Home" : "Add to Home"}
                                        >
                                            {togglingId === product._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-concrete" />
                                            ) : (
                                                <Star className={`w-5 h-5 ${product.isFeatured ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} />
                                            )}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/edit/${product._id}`}>
                                                <button className="p-2 text-concrete hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
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
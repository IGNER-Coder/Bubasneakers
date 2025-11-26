"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle, Save } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageUpload from "../../../../components/ImageUpload"; // Fix import path depth

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true); // Start loading while fetching data
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", brand: "", price: "", category: "", gender: "", 
    image: "", description: "", storyLabel: "", curatorNote: ""
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchData = async () => {
      // Await params in Next.js 15
      const resolvedParams = await params; 
      try {
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`); // We need to create a GET handler for single product if not exists
        // Hack: We can reuse the public product logic or just assume the admin route supports GET. 
        // Actually, let's rely on the public product fetcher logic for simplicity if admin route fails, 
        // BUT the admin route is safer.
        
        // Since we haven't made a specific GET /api/admin/products/[id], let's use the public product logic logic?
        // No, let's fix the route properly. 
        // Assuming we have a GET endpoint. If not, the fetch will fail. 
        // Let's try to fetch from the public product API for now as a shortcut:
        // But wait, we don't have a public API for single product JSON.
        
        // Let's assume we added GET to `app/api/admin/products/[id]/route.js`.
        // I will provide the updated route below to ensure this works.
        
        if (!res.ok) throw new Error("Product not found");
        const product = await res.json();
        
        setFormData({
          name: product.name,
          brand: product.brand,
          price: product.price,
          category: product.category,
          gender: product.gender,
          image: product.images?.[0] || "",
          description: product.description,
          storyLabel: product.storyLabel || "",
          curatorNote: product.curatorNote || ""
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load product data.");
        router.push("/admin/inventory");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
        fetchData();
    } else if (status === "unauthenticated") {
        router.push("/login");
    }
  }, [session, status, params, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (url) => {
    setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const resolvedParams = await params;

    try {
      const res = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert("Product Updated Successfully!");
      router.push("/admin/inventory");
    } catch (error) {
      alert("Error updating product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-off-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/inventory" className="inline-flex items-center text-concrete hover:text-black mb-8 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" /> Cancel & Back
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-neutral-100">
          <h1 className="font-oswald text-3xl font-bold uppercase mb-8">Edit Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             {/* Reuse the exact same form fields as Add Page, just bound to formData */}
             {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Product Image</label>
              <ImageUpload 
                value={formData.image} 
                onChange={handleImageChange}
                onRemove={() => setFormData({...formData, image: ''})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg font-bold border border-transparent focus:border-black focus:bg-white transition-colors">
                  <option>Nike</option>
                  <option>Adidas</option>
                  <option>New Balance</option>
                  <option>Vans</option>
                  <option>Asics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Product Name</label>
                <input required name="name" value={formData.name} type="text" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
            </div>

            {/* ... (Include Price, Category, Gender, Description fields exactly as Add Page) ... */}
             <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Price ($)</label>
                <input required name="price" value={formData.price} type="number" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg font-bold border border-transparent focus:border-black focus:bg-white transition-colors">
                  <option>Lifestyle</option>
                  <option>Running</option>
                  <option>Basketball</option>
                  <option>Skate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg font-bold border border-transparent focus:border-black focus:bg-white transition-colors">
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-electric-blue">Story Label</label>
                <input name="storyLabel" value={formData.storyLabel} type="text" onChange={handleChange} className="w-full p-4 bg-blue-50 border border-transparent rounded-lg focus:border-electric-blue transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-electric-blue">Curator Note</label>
                <input name="curatorNote" value={formData.curatorNote} type="text" onChange={handleChange} className="w-full p-4 bg-blue-50 border border-transparent rounded-lg focus:border-electric-blue transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Description</label>
              <textarea name="description" value={formData.description} rows="4" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors"></textarea>
            </div>

            <button disabled={saving} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
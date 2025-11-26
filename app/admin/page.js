"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageUpload from "../../components/ImageUpload"; 

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Initial state to easily reset later
  const initialFormState = {
    name: "",
    brand: "Nike",
    price: "",
    category: "Lifestyle",
    gender: "Men",
    image: "",
    description: "",
    storyLabel: "",
    curatorNote: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  // 🔒 SECURITY CHECK: Kick out if not admin
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [status, session, router]);

  // Prevent flash of content while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (url) => {
    setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
         const errorText = await res.text(); 
         throw new Error(errorText || "Failed");
      }

      // ✅ SUCCESS STATE
      setSuccess(true);
      
      // 🔄 RESET FORM (Instead of redirecting)
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormState); // Clear all inputs
        window.scrollTo(0, 0); // Scroll to top for next entry
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      alert("Error creating product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white fixed inset-0 z-50">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="font-oswald text-4xl font-bold uppercase">Drop Created!</h1>
        <p className="text-concrete mt-2">Getting ready for the next one...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/admin" className="inline-flex items-center text-concrete hover:text-black mb-8 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-neutral-100">
          <h1 className="font-oswald text-3xl font-bold uppercase mb-8">Add New Drop</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Product Image</label>
              <ImageUpload 
                value={formData.image} 
                onChange={handleImageChange}
                onRemove={() => setFormData({...formData, image: ''})}
              />
            </div>

            {/* 2. Brand & Name */}
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
                <input required name="name" value={formData.name} type="text" placeholder="e.g. Air Max 1" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
            </div>

            {/* 3. Price & Category */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Price ($)</label>
                <input required name="price" value={formData.price} type="number" placeholder="150" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
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

            {/* 4. Storytelling (Editorial) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-electric-blue">Story Label</label>
                <input name="storyLabel" value={formData.storyLabel} type="text" placeholder="e.g. THE ICON" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-electric-blue">Curator Note</label>
                <input name="curatorNote" value={formData.curatorNote} type="text" placeholder="e.g. A timeless classic." onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
            </div>

            {/* 5. Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Description</label>
              <textarea name="description" value={formData.description} rows="4" placeholder="Details..." onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors"></textarea>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Launch Product"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
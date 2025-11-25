"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UploadCloud, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "Nike",
    price: "",
    category: "Lifestyle",
    gender: "Men",
    image: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending data...", formData);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Crucial Header
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        alert(`Failed: ${data.message}`); // Show specific error from API
      }
    } catch (error) {
      console.error("Client Error:", error);
      alert("Network error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="font-oswald text-4xl font-bold uppercase">Drop Created!</h1>
        <p className="text-concrete mt-2">Redirecting to dashboard...</p>
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
            
            {/* 1. Brand & Name */}
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
                <input required name="name" type="text" placeholder="e.g. Air Max 1" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
            </div>

            {/* 2. Price & Category */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Price ($)</label>
                <input required name="price" type="number" placeholder="150" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
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

            {/* 3. Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Image URL</label>
              <div className="relative">
                <input required name="image" type="url" placeholder="https://..." onChange={handleChange} className="w-full p-4 pl-12 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
                <UploadCloud className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-concrete" />
              </div>
            </div>

            {/* 4. Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Description</label>
              <textarea name="description" rows="4" placeholder="Details..." onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors"></textarea>
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
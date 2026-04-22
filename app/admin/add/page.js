"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ImageUpload from "../../../components/ImageUpload"; 

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const initialFormState = {
    name: "",
    brand: "Nike",
    price: "",
    category: "Lifestyle",
    gender: "Men",
    images: [],
    description: "",
    storyLabel: "", 
    curatorNote: "",
    sizes: [{ size: 40, stock: 1 }, { size: 41, stock: 1 }, { size: 42, stock: 1 }, { size: 43, stock: 1 }]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [status, session, router]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (newImages) => {
    setFormData({ ...formData, images: newImages });
  };

  const handleAddSize = () => {
    setFormData(prev => ({
       ...prev,
       sizes: [...prev.sizes, { size: '', stock: 1 }]
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleRemoveSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  // 🆕 UPDATED DEBUGGING HANDLER
  const handleAutoFill = async () => {
    if (formData.images.length === 0) return alert("Upload an image first!");
    
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formData.images[0] }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 🚨 THIS WILL SHOW THE REAL ERROR FROM THE SERVER
        throw new Error(data.message || "AI Server Error");
      }

      // Merge AI data
      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        brand: data.brand || prev.brand,
        price: data.price || prev.price,
        category: data.category || prev.category,
        gender: data.gender || prev.gender,
        description: data.description || prev.description,
        storyLabel: data.storyLabel || prev.storyLabel,
        curatorNote: data.curatorNote || prev.curatorNote,
      }));

    } catch (error) {
      console.error("AI Error:", error);
      alert(`AI Failed: ${error.message}`); // Shows specific error now
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation to ensure at least one image exists
    if (formData.images.length === 0) {
        alert("Please upload at least one image.");
        setLoading(false);
        return;
    }

    if (!formData.sizes || formData.sizes.length === 0) {
        alert("Please add at least one size.");
        setLoading(false);
        return;
    }

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

      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormState);
        window.scrollTo(0, 0);
      }, 2000);

    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error creating product. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white fixed inset-0 z-50">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
        <h1 className="font-oswald text-4xl font-bold uppercase">Drop Created!</h1>
        <p className="text-concrete mt-2">Ready for the next one...</p>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="font-oswald text-3xl font-bold uppercase">Add New Drop</h1>
              
              {formData.images.length > 0 && (
                  <button 
                    onClick={handleAutoFill}
                    disabled={aiLoading}
                    className="flex items-center gap-2 bg-electric-blue/10 text-electric-blue px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-electric-blue hover:text-white transition-all disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {aiLoading ? "Analyzing..." : "Auto-Fill Details"}
                  </button>
              )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Product Gallery</label>
              <ImageUpload 
                value={formData.images} 
                onChange={handleImagesChange}
                onRemove={(newImages) => setFormData({...formData, images: newImages})}
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
                  <option>Jordan</option>
                  <option>Yeezy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Product Name</label>
                <input required name="name" value={formData.name} type="text" placeholder="e.g. Air Max 1" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Price (KES)</label>
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
                <input name="storyLabel" value={formData.storyLabel} type="text" placeholder="e.g. THE GRAIL" onChange={handleChange} className="w-full p-4 bg-blue-50 border border-transparent rounded-lg focus:border-electric-blue transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-electric-blue">Curator Note</label>
                <input name="curatorNote" value={formData.curatorNote} type="text" placeholder="e.g. A timeless classic." onChange={handleChange} className="w-full p-4 bg-blue-50 border border-transparent rounded-lg focus:border-electric-blue transition-colors" />
              </div>
            </div>

            {/* SIZES MATRIX */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-black">Inventory (Sizes & Stock)</label>
                <button type="button" onClick={handleAddSize} className="text-xs font-bold uppercase tracking-wider text-electric-blue hover:text-blue-700">
                  + Add Size
                </button>
              </div>
              <div className="space-y-3">
                {formData.sizes.map((sizeObj, index) => (
                  <div key={index} className="flex gap-4 items-center">
                     <div className="flex-1 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-concrete">Euro Size</span>
                        <input type="text" value={sizeObj.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} required placeholder="e.g. 42" className="w-full p-3 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-concrete">Quantity in Stock</span>
                        <input type="number" min="0" value={sizeObj.stock} onChange={(e) => handleSizeChange(index, 'stock', e.target.value)} required className="w-full p-3 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white" />
                     </div>
                     <div className="pt-5">
                       <button type="button" onClick={() => handleRemoveSize(index)} className="text-red-400 hover:text-red-600 p-2 font-bold text-xl">&times;</button>
                     </div>
                  </div>
                ))}
                {formData.sizes.length === 0 && <p className="text-sm text-concrete italic">No sizes added. Product will be marked as Out of Stock.</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Description</label>
              <textarea name="description" value={formData.description} rows="4" onChange={handleChange} className="w-full p-4 bg-neutral-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors"></textarea>
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin" /> : "Launch Product"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
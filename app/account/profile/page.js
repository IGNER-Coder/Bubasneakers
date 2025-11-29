"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Lock, User as UserIcon, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Read-only
    phone: "",
    address: "",
    city: "",
    currentPassword: "",
    newPassword: ""
  });

  // Fetch User Data on Load
  useEffect(() => {
    // In a real app, fetch from /api/account/profile
    // For now, pre-fill from session
    if (session?.user) {
        setFormData(prev => ({
            ...prev,
            name: session.user.name,
            email: session.user.email
        }));
        setLoading(false);
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update");

      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Clear password fields for security
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-off-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-off-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/account" className="inline-flex items-center text-concrete hover:text-black mb-8 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-neutral-100">
          <h1 className="font-oswald text-3xl font-bold uppercase mb-8">My Details</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Info */}
            <section className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-concrete">
                    <UserIcon className="w-4 h-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-black">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-black">Email (Cannot Change)</label>
                        <input name="email" value={formData.email} disabled type="email" className="w-full p-3 bg-neutral-100 text-concrete rounded-lg border border-neutral-200 cursor-not-allowed" />
                    </div>
                </div>
            </section>

            <hr className="border-neutral-100" />

            {/* Shipping Info */}
            <section className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-concrete">
                    <MapPin className="w-4 h-4" /> Default Shipping
                </h3>
                <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-black">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} type="text" placeholder="0712 345 678" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-black">City</label>
                            <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="Nairobi" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-black">Address / Building</label>
                            <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="CBD, Moi Avenue" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-neutral-100" />

            {/* Security */}
            <section className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-concrete">
                    <Lock className="w-4 h-4" /> Security (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-black">Current Password</label>
                        <input name="currentPassword" value={formData.currentPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-black">New Password</label>
                        <input name="newPassword" value={formData.newPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:border-black outline-none" />
                    </div>
                </div>
            </section>

            {/* Feedback Message */}
            {message.text && (
                <div className={`p-4 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <button 
              disabled={saving}
              className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-electric-blue transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
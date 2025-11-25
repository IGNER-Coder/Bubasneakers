"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
    // Special case for name since input type is text
    if (e.target.placeholder === "Full Name") {
      setFormData({ ...formData, name: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Validation Restrictions
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are necessary.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // 2. API Call
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE: The Vibe (Hidden on Mobile) */}
      <div className="hidden lg:block relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop" 
          alt="Buba Aesthetics" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-20 left-10 text-white z-10">
          <h2 className="font-oswald text-6xl font-bold leading-tight mb-4">JOIN THE<br/>MOVEMENT.</h2>
          <p className="text-neutral-300 max-w-md text-lg">Get early access to drops, track your orders, and build your collection.</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h1 className="font-oswald text-4xl font-bold mb-2">CREATE ACCOUNT</h1>
            <p className="text-concrete">Enter your details below to create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Full Name</label>
              <input
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                type="text"
                placeholder="Jordan Doe"
                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Email Address</label>
              <input
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email"
                placeholder="name@example.com"
                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="space-y-1 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Password</label>
              <div className="relative">
                <input
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition-all pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-concrete hover:text-black"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-lg font-medium flex items-center gap-2 animate-fade-in">
                <div className="w-1 h-1 bg-red-600 rounded-full" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className="w-full bg-black text-white font-bold py-4 rounded-full uppercase tracking-widest hover:bg-electric-blue transition-all mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
            </button>

          </form>

          <div className="text-center mt-8 border-t border-neutral-100 pt-8">
            <p className="text-sm text-concrete">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials.");
        setIsLoading(false);
        return;
      }

      router.replace("/"); 
      router.refresh(); 
    } catch (error) {
      setError("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE: The Form (First on Desktop) */}
      <div className="flex items-center justify-center p-8 bg-white animate-fade-in order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="font-oswald text-4xl font-bold mb-2">WELCOME BACK</h1>
            <p className="text-concrete">Sign in to access your drops</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-concrete">Email Address</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all" />
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-concrete">Password</label>
                <Link href="#" className="text-xs font-bold text-electric-blue hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-concrete hover:text-black">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-lg font-medium flex items-center gap-2">
                <div className="w-1 h-1 bg-red-600 rounded-full" />{error}
              </div>
            )}

            <button disabled={isLoading} className="w-full bg-black text-white font-bold py-4 rounded-full uppercase tracking-widest hover:bg-electric-blue transition-all mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="text-center mt-8 border-t border-neutral-100 pt-8">
            <p className="text-sm text-concrete">Don't have an account? <Link href="/register" className="text-black font-bold hover:underline">Sign Up</Link></p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Vibe (Swapped & Tinted Blue) */}
      <div className="hidden lg:block relative bg-electric-blue order-1 lg:order-2">
        <img 
          src="https://images.unsplash.com/photo-1607522370275-f14206c1996d?q=80&w=2000&auto=format&fit=crop" 
          alt="Buba Aesthetics" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply"
        />
        <div className="absolute bottom-20 right-10 text-white z-10 text-right">
          <h2 className="font-oswald text-6xl font-bold leading-tight mb-4">SECURE<br/>THE BAG.</h2>
          <p className="text-white/80 max-w-md ml-auto text-lg">Your cart is waiting. Finish what you started.</p>
        </div>
      </div>

    </div>
  );
}
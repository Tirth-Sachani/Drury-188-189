"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isInitialized } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/admin");
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Minor delay to feel "premium" and show loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-6 selection:bg-roast selection:text-napkin">
      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h1 className="serif text-4xl md:text-5xl text-roast italic">Drury Admin</h1>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md bg-[#FAF9F6] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-roast/5 p-10 md:p-12 relative overflow-hidden"
      >
        {/* Subtle Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-roast/20 to-transparent"></div>

        <div className="text-center mb-10">
          <h2 className="serif text-3xl text-roast mb-2">Artisan Login</h2>
          <p className="monolith text-[10px] tracking-[0.3em] uppercase opacity-40">Access the Workshop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="monolith text-[9px] uppercase tracking-widest opacity-60 ml-1">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@drury.com"
                required
                className="w-full bg-[#F5F2ED]/50 border border-roast/10 rounded-lg px-4 py-4 pl-11 text-sm focus:outline-none focus:border-roast/30 transition-all placeholder:opacity-30"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-60 transition-opacity" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="monolith text-[9px] uppercase tracking-widest opacity-60 ml-1">Password</label>
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F5F2ED]/50 border border-roast/10 rounded-lg px-4 py-4 pl-11 text-sm focus:outline-none focus:border-roast/30 transition-all placeholder:opacity-30"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-60 transition-opacity" />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-roast text-napkin py-5 rounded-lg text-[11px] tracking-[0.4em] uppercase font-bold shadow-lg shadow-roast/10 hover:bg-roast/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-napkin/20 border-t-napkin rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button className="monolith text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            Forgot Password
          </button>
          
          <div className="w-12 h-[1px] bg-roast/10"></div>
          
          <Link 
            href="/login/admin/register" 
            className="monolith text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            Request Access
          </Link>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-12"
      >
        <p className="serif italic text-roast opacity-30 text-xs text-center tracking-wide">Disconnect to Reconnect</p>
      </motion.div>
    </div>
  );
}

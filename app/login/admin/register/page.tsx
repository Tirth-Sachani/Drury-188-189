"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Briefcase, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Minor delay to feel "premium"
    await new Promise((resolve) => setTimeout(resolve, 1000));

    register({
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#FAF9F6] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-roast/5 p-12 text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="serif text-3xl text-roast mb-4">Request Submitted</h2>
          <p className="monolith text-[10px] tracking-widest opacity-60 leading-relaxed mb-8 uppercase">
            Our curators will review your application and provide credentials via email within 24 hours.
          </p>
          <Link
            href="/login/admin"
            className="inline-block bg-roast text-napkin px-8 py-4 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-6 selection:bg-roast selection:text-napkin overflow-y-auto pt-12 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl bg-[#FAF9F6] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-roast/5 p-10 md:p-16 relative"
      >
        {/* Background Large "8-" decoration from design */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-serif italic text-roast/[0.02] pointer-events-none select-none z-0">
          8-
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <span className="serif text-xl italic text-roast/60 block mb-2">Drury Admin</span>
            <h1 className="serif text-4xl md:text-6xl text-roast mb-6">Request Artisan Access</h1>
            <p className="monolith text-[10px] tracking-widest opacity-50 uppercase max-w-sm mx-auto leading-loose">
              Apply for administrative credentials to the Drury digital archive and management suite.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="monolith text-[9px] uppercase tracking-[0.3em] opacity-60 ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Evelyn Thorne"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#F5F2ED]/30 border border-roast/10 rounded-lg px-4 py-5 text-sm focus:outline-none focus:border-roast/30 transition-all placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="monolith text-[9px] uppercase tracking-[0.3em] opacity-60 ml-1">Work Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="e.thorne@drury.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F5F2ED]/30 border border-roast/10 rounded-lg px-4 py-5 text-sm focus:outline-none focus:border-roast/30 transition-all placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="monolith text-[9px] uppercase tracking-[0.3em] opacity-60 ml-1">Role</label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#F5F2ED]/30 border border-roast/10 rounded-lg px-4 py-5 text-sm focus:outline-none focus:border-roast/30 transition-all appearance-none"
                >
                  <option value="" disabled className="text-roast/30">Select your department</option>
                  <option value="Curator">Curator</option>
                  <option value="Manager">Manager</option>
                  <option value="Owner">Owner</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="monolith text-[9px] uppercase tracking-[0.3em] opacity-60 ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#F5F2ED]/30 border border-roast/10 rounded-lg px-4 py-5 text-sm focus:outline-none focus:border-roast/30 transition-all placeholder:opacity-30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-roast text-napkin py-6 rounded-lg text-[10px] tracking-[0.5em] uppercase font-bold shadow-xl shadow-roast/10 hover:bg-roast/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-napkin/20 border-t-napkin rounded-full animate-spin"></span>
              ) : (
                <>Submit Request <span className="text-lg">→</span></>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-[10px] monolith">
            <span className="opacity-40">Already have access? </span>
            <Link href="/login/admin" className="text-roast font-bold hover:underline">Log in</Link>
          </div>
        </div>
      </motion.div>

      {/* Security Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex items-center gap-8 opacity-30 text-[8px] monolith tracking-widest uppercase"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-roast/40 animate-pulse"></div>
          <span>Secure Portal</span>
        </div>
        <div className="w-[1px] h-3 bg-roast/20"></div>
        <div className="flex items-center gap-2">
          <span>RSA-4096</span>
        </div>
      </motion.div>
    </div>
  );
}

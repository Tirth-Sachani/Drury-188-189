"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import gsap from "gsap";

const Newsletter = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setStatus("loading");
    setMessage("Joining the ritual...");

    const emailTrimmed = email.trim().toLowerCase();

    // Basic Validation
    if (!emailTrimmed || !emailTrimmed.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      
      // Error shake animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: {
            "0%": { x: 0 },
            "20%": { x: -10 },
            "40%": { x: 10 },
            "60%": { x: -10 },
            "80%": { x: 10 },
            "100%": { x: 0 }
          },
          duration: 0.4,
          ease: "power2.inOut"
        });
      }
      return;
    }

    try {
      // Prevent duplicate emails
      const q = query(collection(db, "subscribers"), where("email", "==", emailTrimmed));
      const existing = await getDocs(q);

      if (!existing.empty) {
        setStatus("error");
        setMessage("You are already part of the ritual.");
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, "subscribers"), {
        email: emailTrimmed,
        createdAt: serverTimestamp(),
        status: "active"
      });

      setStatus("success");
      setMessage("Welcome to the community.");
      setEmail("");

      // Success animation
      if (messageRef.current) {
        gsap.fromTo(messageRef.current, 
          { opacity: 0, y: 10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
        );
      }

      // Fade out input/button
      if (formRef.current) {
        gsap.to(formRef.current.querySelector("input"), { opacity: 0.3, pointerEvents: "none", duration: 0.5 });
        gsap.to(formRef.current.querySelector("button"), { backgroundColor: "rgba(200, 146, 74, 0.4)", scale: 0.95, duration: 0.5 });
      }

    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (!hasMounted) return null;

  return (
    <section className="py-48 bg-napkin border-t border-roast/5 relative overflow-hidden" suppressHydrationWarning>
      {/* Liquid Gold Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(223,178,118,0.05)_0%,rgba(255,255,255,0)_70%)] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto">
          <h3 className="serif text-5xl md:text-8xl italic text-roast mb-8">
            Join the Ritual.
          </h3>
          <p className="monolith text-[10px] md:text-xs tracking-[0.5em] text-roast/60 mb-16 uppercase">
            Exclusive Roasts • Art Previews • Event Access
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20" suppressHydrationWarning>
             <div className="space-y-4">
                <span className="serif text-3xl text-roast">Weekly</span>
                <p className="monolith text-[9px] opacity-40 uppercase tracking-widest leading-relaxed">Early access to our finest micro-lots and limited roasts.</p>
             </div>
             <div className="space-y-4">
                <span className="serif text-3xl text-roast text-crema">Artisan</span>
                <p className="monolith text-[9px] opacity-40 uppercase tracking-widest leading-relaxed">Behind-the-scenes look at the Napkin Art residency program.</p>
             </div>
             <div className="space-y-4">
                <span className="serif text-3xl text-roast">Private</span>
                <p className="monolith text-[9px] opacity-40 uppercase tracking-widest leading-relaxed">Heads up on our quarterly courtyard concerts and cupping sessions.</p>
             </div>
          </div>

          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative max-w-md mx-auto group" 
            suppressHydrationWarning
          >
            <input 
              type="email" 
              placeholder={status === "success" ? "THANK YOU" : "YOUR EMAIL"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              suppressHydrationWarning
              className="w-full bg-transparent border-b border-roast/40 py-8 monolith text-[12px] tracking-[0.5em] focus:outline-none focus:border-roast transition-all text-center uppercase text-roast placeholder:text-roast/20"
            />
            <button 
              suppressHydrationWarning
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`mt-12 monolith text-[10px] tracking-[0.6em] uppercase text-napkin bg-roast px-16 py-6 rounded-full hover:bg-crema hover:text-roast transition-all duration-300 shadow-xl ${status === "loading" ? "opacity-70 cursor-wait" : ""}`}
            >
              {status === "loading" ? "Joining..." : status === "success" ? "Subscribed" : "Subscribe"}
            </button>
            
            {message && (
              <p 
                ref={messageRef}
                className={`mt-12 monolith text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  status === "error" ? "text-red-500/80" : status === "success" ? "text-roast" : "text-roast/30"
                }`}
              >
                {message}
              </p>
            )}

            {status !== "success" && (
              <p className="mt-8 monolith text-[8px] tracking-[0.3em] text-roast/30 uppercase italic font-light">
                Trusted by 5,000+ Coffee Seekers
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;


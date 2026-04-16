"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker from "@/components/DatePicker";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function VisitPage() {
  const mainRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Covent Garden (Walk-in)",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Page Load Animation
      const tl = gsap.timeline();
      
      // Title Reveal
      tl.from(".reveal-text span", {
        y: "110%",
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
      });

      tl.from(".reveal-sub", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");

      // Form Elements Stagger
      if (formRef.current) {
        const formElements = formRef.current.querySelectorAll(".form-group");
        tl.from(formElements, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)"
        }, "-=0.6");
      }

      // 2. Right Side Image Parallax & Scale Reveal
      gsap.fromTo(".visit-image-container", 
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        { 
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
          duration: 1.5, 
          ease: "power3.inOut",
          delay: 0.2
        }
      );

      gsap.fromTo(".visit-image", 
        { scale: 1.2 },
        { 
          scale: 1, 
          duration: 2, 
          ease: "power2.out",
          delay: 0.2
        }
      );

      // Scroll parallax for the image
      gsap.to(".visit-image", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".visit-image-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // 3. Floating Interaction Badges
      gsap.to(".floating-badge", {
        y: "-=10",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.email.includes("@") || !formData.message) {
      gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.4 });
      return;
    }

    setStatus("loading");

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        date: selectedDate ? selectedDate.toISOString() : null,
        createdAt: serverTimestamp(),
        status: "new"
      });

      setStatus("success");

      // Success Animation
      const tl = gsap.timeline();
      tl.to(formRef.current, { opacity: 0, y: -20, duration: 0.5, pointerEvents: "none" });
      tl.fromTo(successRef.current, 
        { opacity: 0, scale: 0.9, display: "none" },
        { opacity: 1, scale: 1, display: "block", duration: 0.8, ease: "back.out(1.7)" }
      );

    } catch (error) {
      console.error("Inquiry error:", error);
      setStatus("error");
    }
  };

  return (
    <main ref={mainRef} className="min-h-screen bg-napkin text-roast font-sans selection:bg-roast selection:text-napkin overflow-x-hidden">

      <section className="pt-32 lg:pt-0 min-h-screen flex flex-col lg:flex-row relative">
        
        {/* Left Side: Form & Info */}
        <div className="w-full lg:w-1/2 px-6 md:px-16 lg:px-24 flex flex-col justify-center py-12 lg:py-40 relative z-10">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            
            <h1 className="serif text-5xl md:text-7xl lg:text-8xl mb-6 relative overflow-hidden">
              <span className="reveal-text block overflow-hidden pb-4">
                <span className="inline-block">Plan Your</span>
              </span>
              <span className="reveal-text block overflow-hidden pb-4">
                <span className="inline-block italic text-crema">Visit.</span>
              </span>
            </h1>
            
            <p className="reveal-sub monolith text-xs uppercase tracking-widest opacity-60 leading-relaxed mb-16">
              Whether you're picking up a morning flat white or settling in for an afternoon of deep work at Drury N4, we're ready to welcome you.
            </p>

            <div ref={successRef} className="hidden py-20 text-center">
              <h2 className="serif text-4xl mb-6">Inquiry Sent.</h2>
              <p className="monolith text-[10px] uppercase tracking-widest opacity-60">We'll reach out to your ritual soon.</p>
              <button 
                onClick={() => {
                  setStatus("idle");
                  setFormData({ name: "", email: "", phone: "", location: "Covent Garden (Walk-in)", message: "" });
                  setSelectedDate(null);
                  gsap.to(successRef.current, { opacity: 0, duration: 0.3, onComplete: () => {
                    gsap.set(successRef.current, { display: "none" });
                    gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, pointerEvents: "all" });
                  }});
                }}
                className="mt-12 monolith text-[9px] uppercase tracking-widest border-b border-roast/20 pb-2 hover:border-roast transition-all"
              >
                Send another inquiry
              </button>
            </div>

            <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
              <div className="form-group border-b border-roast/20 relative group">
                <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="w-full bg-transparent py-3 text-roast placeholder:text-roast/20 focus:outline-none transition-colors serif text-xl"
                />
                <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
              </div>

              <div className="form-group flex flex-col md:flex-row gap-6 relative z-40">
                <div className="flex-1 border-b border-roast/20 relative group">
                  <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="w-full bg-transparent py-3 text-roast placeholder:text-roast/20 focus:outline-none transition-colors serif text-xl"
                  />
                  <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
                </div>
                <div className="flex-1 border-b border-roast/20 relative group">
                  <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Phone (Optional)</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+44 7700 900000" 
                    className="w-full bg-transparent py-3 text-roast placeholder:text-roast/20 focus:outline-none transition-colors serif text-xl"
                  />
                  <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="form-group flex flex-col md:flex-row gap-6 relative z-30">
                <div className="flex-1 border-b border-roast/20 relative group">
                  <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Location</label>
                  <select 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-transparent py-3 text-roast focus:outline-none transition-colors serif text-lg md:text-xl appearance-none cursor-pointer"
                  >
                    <option>Covent Garden (Walk-in)</option>
                    <option>Drury N4 (Workspace)</option>
                  </select>
                  <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
                </div>
                <div className="flex-1 border-b border-roast/20 relative group mt-8 md:mt-0">
                  <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Date</label>
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                  <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="form-group border-b border-roast/20 relative group">
                <label className="monolith text-[9px] uppercase tracking-widest opacity-50 block mb-2 transition-opacity group-focus-within:opacity-100">Message (Required)</label>
                <textarea 
                  rows={2}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Any special requirements?" 
                  className="w-full bg-transparent py-3 text-roast placeholder:text-roast/20 focus:outline-none transition-colors serif text-xl resize-none"
                />
                <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-roast transition-all duration-500 group-focus-within:w-full"></div>
              </div>

              <div className="form-group pt-8">
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className={`w-full bg-roast text-napkin py-5 pt-6 rounded-full monolith text-[10px] uppercase tracking-[0.3em] hover:bg-crema hover:text-roast transition-all duration-500 transform hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] ${status === "loading" ? "opacity-70 cursor-wait" : ""}`}
                >
                  {status === "loading" ? "Sending..." : "Send Inquiry"}
                </button>
                {status === "error" && (
                  <p className="mt-4 monolith text-[8px] uppercase tracking-widest text-red-500 text-center">Something went wrong. Please try again.</p>
                )}
              </div>
            </form>

          </div>
        </div>

        {/* Right Side: Visuals (Sticky on Desktop) */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen lg:sticky lg:top-0 p-4 lg:p-8 lg:pt-32 flex flex-col justify-center lg:justify-end pb-8 lg:pb-12">
          <div className="visit-image-container w-full h-full rounded-[2rem] overflow-hidden relative shadow-2xl">
            {/* Parallax Image */}
            <div 
              className="visit-image absolute -inset-10 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80')" }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-roast/20 mix-blend-multiply"></div>

            {/* Floating Info Badges */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-20">
              <div className="floating-badge bg-napkin/90 backdrop-blur-md text-roast rounded-full px-5 py-2 md:px-6 md:py-3 shadow-xl">
                <span className="monolith text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Open Today</span>
              </div>
              <div className="floating-badge bg-crema/90 backdrop-blur-md text-roast rounded-full px-5 py-2 md:px-6 md:py-3 shadow-xl">
                <span className="monolith text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Until 18:00</span>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 bg-napkin/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl z-20 border border-roast/5">
              <div>
                <h3 className="serif text-3xl mb-3 text-roast">Covent Garden</h3>
                <p className="monolith text-[9px] uppercase tracking-[0.2em] text-roast/50">188-189 Drury Lane, WC2B 5QD</p>
              </div>
              <a 
                href="https://maps.google.com/?q=188-189+Drury+Lane,+London" 
                target="_blank" 
                rel="noreferrer"
                className="monolith text-[9px] md:text-[10px] tracking-[0.2em] uppercase border border-roast/10 py-4 px-8 rounded-full hover:bg-roast hover:text-napkin transition-all duration-500 shrink-0 bg-white"
              >
                Directions
              </a>
            </div>
          </div>
        </div>
        
      </section>
    </main>
  );
}

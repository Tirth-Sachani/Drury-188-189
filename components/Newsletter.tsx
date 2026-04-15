"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const ctx = gsap.context(() => {
      // Robust Reveal
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          }
        }
      );

      gsap.from(".newsletter-fade", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });

      // Liquid background shift
      gsap.to(".liquid-bg", {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);
    return () => ctx.revert();
  }, [hasMounted]);

  if (!hasMounted) return null;

  return (
    <section ref={containerRef} className="py-48 bg-napkin border-t border-roast/5 relative overflow-hidden" suppressHydrationWarning>
      {/* Liquid Gold Background Element */}
      <div className="liquid-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(223,178,118,0.05)_0%,rgba(255,255,255,0)_70%)] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto">
          <h3 ref={titleRef} className="serif text-5xl md:text-8xl italic text-roast mb-8">
            Join the Ritual.
          </h3>
          <p className="newsletter-fade monolith text-[10px] md:text-xs tracking-[0.5em] text-roast/60 mb-16 uppercase">
            Exclusive Roasts • Art Previews • Event Access
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 newsletter-fade" suppressHydrationWarning>
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

          <form className="newsletter-fade relative max-w-md mx-auto group" suppressHydrationWarning>
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              suppressHydrationWarning
              className="w-full bg-transparent border-b border-roast/40 py-8 monolith text-[12px] tracking-[0.5em] focus:outline-none focus:border-roast transition-all text-center uppercase text-roast placeholder:text-roast/20"
            />
            <button 
              suppressHydrationWarning
              type="submit"
              className="mt-12 monolith text-[10px] tracking-[0.6em] uppercase text-napkin bg-roast px-16 py-6 rounded-full hover:bg-crema hover:text-roast transition-all duration-700 shadow-xl"
            >
              Subscribe
            </button>
            <p className="mt-12 monolith text-[8px] tracking-[0.3em] text-roast/30 uppercase italic font-light">
              Trusted by 5,000+ Coffee Seekers
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import LiquidCanvas from "./LiquidCanvas";
import { useStore } from "@/lib/store";

const Hero = () => {
  const { settings } = useStore();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title", 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.1 }
      );
      
      gsap.fromTo(".hero-subtitle", 
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 0.3 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-napkin">
      <LiquidCanvas />
      <div className="container mx-auto px-6 text-center z-10">
        <h2 className="monolith text-[9px] md:text-[10px] mb-6 md:mb-8 tracking-[0.4em] hero-subtitle uppercase">
          {settings.tagline}
        </h2>
        
        <h1 className="serif text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] tracking-tight leading-[1.1] md:leading-[0.9] hero-title italic">
          Welcome <br />
          <span className="not-italic">to Drury</span>
        </h1>
        
        <div className="mt-12 md:mt-16 hero-title opacity-70">
          <p className="monolith text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-6 md:mb-8">
            {settings.description}
          </p>
          <div className="w-[1px] h-12 md:h-20 bg-roast/20 mx-auto mt-6 md:mt-8 animate-pulse"></div>
        </div>
      </div>
      
      {/* Decorative background element (3D-like) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-cream-radial opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default Hero;

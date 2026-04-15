"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LocationCard = ({ 
  name, 
  address, 
  hours, 
  image, 
  reversed 
}: { 
  name: string; 
  address: string; 
  hours: string[]; 
  image: string;
  reversed?: boolean;
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal
      gsap.fromTo(imageRef.current, 
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
        { 
          clipPath: "inset(0% 0% 0% 0%)", 
          scale: 1, 
          duration: 1.5, 
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );

      // Text Stagger
      gsap.from(".loc-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("py-32 flex flex-col items-center gap-16", reversed ? "md:flex-row-reverse" : "md:flex-row")}>
      <div className="w-full md:w-1/2 overflow-hidden rounded-2xl aspect-[4/5] md:aspect-square relative group">
        <img 
          ref={imageRef}
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-roast/10 group-hover:bg-transparent transition-colors duration-700" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h3 className="serif text-5xl md:text-7xl mb-10 text-roast loc-reveal">{name}</h3>
        <p className="monolith text-sm text-roast/60 leading-relaxed mb-8 max-w-sm loc-reveal">{address}</p>
        
        <div className="mb-12 loc-reveal">
          <h4 className="monolith text-[10px] text-roast/40 mb-6 tracking-[0.4em] uppercase">Opening Hours</h4>
          <ul className="space-y-4">
            {hours.map((h, i) => (
              <li key={i} className="monolith text-[11px] text-roast/80">{h}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center gap-8 loc-reveal">
          <a 
            href={`https://maps.google.com?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            className="monolith text-[11px] text-roast font-bold tracking-[0.2em] border-b border-roast/20 hover:border-roast transition-all pb-1 uppercase"
          >
            Get Directions
          </a>
          {name.includes("N4") && (
            <Link href="/work" className="monolith text-[9px] bg-crema text-roast px-4 py-2 rounded-full tracking-widest uppercase hover:bg-roast hover:text-napkin transition-all font-bold">
              Co-working
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LocationsPage() {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".title-reveal", {
        y: 80,
        opacity: 0,
        rotate: 2,
        duration: 2,
        ease: "expo.out",
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-napkin text-roast">
      
      <header ref={headerRef} className="pt-60 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl text-center md:text-left">
          <h1 className="serif text-7xl md:text-[10rem] mb-8 leading-[0.9] title-reveal">
            Our <span className="italic">Sanctuaries.</span>
          </h1>
          <div className="w-24 h-[1px] bg-roast/20 mt-12 title-reveal" />
        </div>
      </header>

      <section className="pb-40">
        <div className="container mx-auto px-6 max-w-6xl">
          <LocationCard 
            name="Covent Garden" 
            address="188-189 Drury Lane, WC2B 5QD, London" 
            hours={["Mon — Fri: 07:30 - 17:00", "Sat — Sun: 08:00 - 18:00"]} 
            image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80"
          />
          
          <LocationCard 
            name="Drury N4 (Woodberry Down)" 
            address="170 Riverside, Woodberry Down, London N4 2GD" 
            hours={["Mon — Fri: 08:00 - 16:00", "Sat — Sun: 09:00 - 15:30"]} 
            image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
            reversed
          />
        </div>
      </section>

    </main>
  );
}

// Helper for class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

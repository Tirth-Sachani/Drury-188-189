"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useStore } from "@/lib/store";

export default function NapkinArtPage() {
  const { napkins, isInitialized } = useStore();
  const filteredNapkins = napkins.filter(n => n.status === "Published");
  const mainRef = useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Content Entrance
      gsap.from(".hero-line span", {
        y: "100%",
        opacity: 0,
        rotateX: -90,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out"
      });

      // 2. Napkin Initial Reveal
      gsap.from(".napkin-wrapper", {
        y: 100,
        opacity: 0,
        rotate: (i) => Math.random() * 20 - 10,
        stagger: 0.1, // slightly slower stagger for more visual impact
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-container",
          start: "top 60%", // wait until section is deeper into view
          toggleActions: "play reverse play reverse", // bidirectional
        }
      });

      // 3. Setup individual card interactions
      const wrappers = gsap.utils.toArray(".napkin-wrapper") as HTMLElement[];
      wrappers.forEach((wrapper, i) => {
        const card = wrapper.querySelector(".napkin-card") as HTMLElement;
        const desc = wrapper.querySelector(".napkin-desc") as HTMLElement;
        const floatContainer = wrapper.querySelector(".float-container") as HTMLElement;

        // 4. Advanced Realistic Water Wave Simulation (GSAP)
        if (floatContainer) {
          const depth = Math.random(); // Distance mapping
          const depthMod = 1 + (depth * 0.6); // Further = slower
          
          const maxX = 18 + Math.random() * 12; // 18 to 30px drifting bounds
          const maxY = 25 + Math.random() * 15; // 25 to 40px bounding box

          // Start at randomized organic offset and scale based on perceived depth
          gsap.set(floatContainer, {
            x: gsap.utils.random(-maxX, maxX),
            y: gsap.utils.random(-maxY, maxY),
            rotation: gsap.utils.random(-2, 2),
            scale: 0.94 + (1 - depth) * 0.06, // Depth scaling effect
            opacity: 0.88 + (1 - depth) * 0.12, // Depth atmospheric effect
          });

          // Horizontal drift (Ocean Current) -> Generates smooth sweeping arcs
          const animateX = () => {
             gsap.to(floatContainer, {
               x: gsap.utils.random(-maxX, maxX),
               duration: gsap.utils.random(8, 14) * depthMod,
               ease: "sine.inOut",
               onComplete: animateX
             });
          };

          // Vertical swell (Wave heights)
          const animateY = () => {
             gsap.to(floatContainer, {
               y: gsap.utils.random(-maxY, maxY),
               duration: gsap.utils.random(6, 12) * depthMod,
               ease: "sine.inOut",
               onComplete: animateY
             });
          };

          // Floating object tilting
          const animateRot = () => {
             gsap.to(floatContainer, {
               rotation: gsap.utils.random(-3, 3),
               duration: gsap.utils.random(10, 16) * depthMod,
               ease: "sine.inOut",
               onComplete: animateRot
             });
          };

          // Trigger continuous fluid movement
          animateX();
          animateY();
          animateRot();
        }

        // 5. Hover Interactions (Magnetic Tilt + Details Reveal)
        if (card) {
          card.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 12; // Minimal, premium tilt
            const rotateY = (centerX - x) / 12;
            
            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              x: (x - centerX) / 15,
              y: (y - centerY) / 15,
              duration: 0.4,
              ease: "power2.out",
              transformPerspective: 1200
            });
          });

          card.addEventListener("mouseenter", () => {
            gsap.to(wrapper, { zIndex: 100, duration: 0.1 });
            gsap.to(card, { 
              scale: 1.05, // Slower, minimal scale, NO elastic bounce
              boxShadow: "0 30px 60px rgba(28, 18, 8, 0.2)",
              borderColor: "rgba(200, 146, 74, 0.3)", 
              duration: 0.6, 
              ease: "sine.out" 
            });
            if (desc) {
              gsap.to(desc, { 
                height: "auto", 
                opacity: 1, 
                marginTop: 16, 
                duration: 0.5, 
                ease: "power3.out" 
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(wrapper, { zIndex: 1, duration: 0.5 });
            gsap.to(card, { 
              scale: 1, 
              rotateX: 0,
              rotateY: 0,
              x: 0,
              y: 0,
              borderColor: "transparent",
              boxShadow: "0 20px 40px rgba(28, 18, 8, 0.1)",
              duration: 0.8, 
              ease: "power2.out" // Replaced elastic bounce with smooth premium ease
            });
            if (desc) {
              gsap.to(desc, { height: 0, opacity: 0, marginTop: 0, duration: 0.4 });
            }
          });
        }
      });

      // 6. Shared Examine Cursor Implementation
      if (cursorRef.current) {
        const xTo = gsap.quickSetter(cursorRef.current, "x", "px");
        const yTo = gsap.quickSetter(cursorRef.current, "y", "px");
        
        const moveCursor = (e: MouseEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };

        window.addEventListener("mousemove", moveCursor);

        const cards = gsap.utils.toArray(".napkin-card") as HTMLElement[];
        cards.forEach(el => {
          el.addEventListener("mouseenter", () => {
            gsap.to(cursorRef.current, { 
              scale: 1, 
              opacity: 1, 
              duration: 0.4, 
              ease: "back.out(1.7)" 
            });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(cursorRef.current, { 
              scale: 0, 
              opacity: 0, 
              duration: 0.3, 
              ease: "power2.in" 
            });
          });
        });

        // Cleanup listener on context revert
        return () => window.removeEventListener("mousemove", moveCursor);
      }

    }, mainRef);

    return () => ctx.revert();
  }, [isInitialized, filteredNapkins.length]);

  if (!hasMounted) return null;

  return (
    <main ref={mainRef} className="min-h-[200vh] bg-napkin text-roast overflow-hidden pb-48 cursor-default">

      {/* Examine Cursor - Maximum Z-index and visibility pass */}
      <div 
        ref={cursorRef}
        className="examine-cursor fixed top-0 left-0 w-24 h-24 border border-roast bg-transparent rounded-full flex items-center justify-center z-[99999] pointer-events-none opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2 mix-blend-difference overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none"></div>
        <span className="monolith text-[10px] tracking-widest uppercase text-roast font-bold relative z-10 pointer-events-none">Examine</span>
      </div>

      <header className="pt-56 pb-32 text-center max-w-4xl mx-auto px-6 relative z-10">
        <h1 className="serif text-7xl md:text-9xl mb-12 flex flex-wrap justify-center overflow-hidden">
          <span className="hero-line block overflow-hidden pb-4"><span className="inline-block">The&nbsp;</span></span>
          <span className="hero-line block overflow-hidden pb-4"><span className="inline-block italic text-crema">Napkin&nbsp;</span></span>
          <span className="hero-line block overflow-hidden pb-4"><span className="inline-block">Archive.</span></span>
        </h1>
        <div className="flex justify-center mb-8">
           <div className="w-[1px] h-24 bg-gradient-to-b from-roast/40 to-transparent"></div>
        </div>
        <p className="monolith text-[11px] leading-loose opacity-60 tracking-widest max-w-2xl mx-auto uppercase">
          A living, breathing collection of sketches, ideas, and fleeting moments captured on ink and paper between espresso shots. Found exclusively on the tables of Drury 188-189.
        </p>
      </header>

      <section className="gallery-container container mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24 mt-20">
          {filteredNapkins.map((napkin, i) => (
            <div 
              key={napkin.id} 
              className={`napkin-wrapper w-full flex justify-center ${napkin.offset || ""}`} 
              data-rotate={napkin.rotate || 0}
            >
              <div className="float-container w-full flex justify-center will-change-transform">
                <div 
                  className="napkin-card group/card bg-[#FDFCFB] p-5 shadow-[0_20px_40px_rgba(28,18,8,0.1)] relative cursor-none border border-transparent will-change-transform"
                  style={{ transform: `rotate(${napkin.rotate || 0}deg)` }}
                >
                  {/* Vintage paper texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                  
                  {/* Napkin image with hover scaling wrapper */}
                  <div className="w-full aspect-square overflow-hidden rounded-sm relative z-0">
                    <div 
                      className="w-full h-full bg-cover bg-center grayscale-50 group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center will-change-transform"
                      style={{ backgroundImage: `url('${napkin.image}')` }}
                    ></div>
                  </div>
                  
                  {/* Details */}
                  <div className="mt-5 flex justify-between items-end border-t border-dashed border-roast/20 pt-4">
                    <div>
                      <span className="serif italic text-[14px] text-roast block mb-1">{napkin.artist}</span>
                      <span className="monolith text-[8px] opacity-40 uppercase tracking-widest">{napkin.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="monolith text-[8px] opacity-30 tracking-[0.2em]">Napkin</span>
                      <span className="monolith text-xs block tracking-widest">#{napkin.id}</span>
                    </div>
                  </div>

                  {/* Hidden Description (Reveals on hover) */}
                  <div className="napkin-desc h-0 overflow-hidden opacity-0">
                    <p className="monolith text-[9px] leading-relaxed text-roast/60 pt-2 border-t border-roast/10 border-dashed">
                      {napkin.desc}
                    </p>
                  </div>
                  
                  {/* Realistic edge shading */}
                  <div className="absolute top-0 right-0 w-full h-full pointer-events-none shadow-[inset_0px_0px_15px_rgba(0,0,0,0.03)] rounded-sm"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-48 mb-24 text-center">
        <p className="serif text-3xl italic mb-6">Leave your mark.</p>
        <p className="monolith text-[10px] opacity-50 tracking-widest uppercase">Ask for a pen at the counter during your next visit.</p>
      </div>


    </main>
  );
}

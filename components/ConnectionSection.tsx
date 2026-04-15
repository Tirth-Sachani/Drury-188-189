"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ConnectionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let reqAfId: number;
    let currentProgress = 0;

    const ctx = gsap.context(() => {
      // Heading Reveal
      gsap.from(".connect-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        rotateX: -20,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.2,
      });

      // Half-Section Scroll Logic for the Grid Container
      if (gridWrapperRef.current) {
        
        // Initial setup for the wrapper
        gsap.set(gridWrapperRef.current, { opacity: 0, y: 100 });

        const updateAnimation = () => {
          if (!sectionRef.current) return;

          const rect = sectionRef.current.getBoundingClientRect();
          const sectionMiddle = rect.top + rect.height / 2;
          const viewportHeight = window.innerHeight;

          // Start when section middle hits top, End when section middle hits bottom
          let targetProgress = 1 - (sectionMiddle / viewportHeight);
          targetProgress = Math.max(0, Math.min(1, targetProgress));

          // Smoothly interpolate scroll progress
          currentProgress += (targetProgress - currentProgress) * 0.1;
          if (Math.abs(targetProgress - currentProgress) < 0.001) {
            currentProgress = targetProgress;
          }

          // Apply animated state to the wrapper based on 0-1 progress
          // We translate smoothly up to y: 0 and fade to opacity 1
          gsap.set(gridWrapperRef.current, {
            opacity: currentProgress,
            y: 100 * (1 - currentProgress),
          });

          reqAfId = requestAnimationFrame(updateAnimation);
        };

        // Start the loop
        reqAfId = requestAnimationFrame(updateAnimation);
      }
      
      // Background Glow Parallax
      gsap.to(".bg-glow", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        y: -100,
        opacity: 0.1,
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      if (reqAfId) cancelAnimationFrame(reqAfId);
    }
  }, [hasMounted]);

  if (!hasMounted) return null;

  const coffeeImages = [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80"
  ];

  return (
    <section ref={sectionRef} className="bg-roast text-napkin relative overflow-visible">
      {/* Dynamic Native CSS Blocks to fulfill premium hover physics requirements exactly */}
      <style dangerouslySetInnerHTML={{__html: `
        .coffee-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          position: relative;
        }

        .coffee-card {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 1rem;
          cursor: crosshair;
          z-index: 10;
          
          /* CRITICAL FIX: Smooth transitions */
          transition: transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease;
          
          /* CRITICAL FIX: Performance */
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .coffee-card-inner {
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(200, 146, 74, 0.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        /* --- UNIQUE MODERN STYLING FOR BADGE --- */
        @keyframes shine-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes ripple-zen {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; border-width: 2px; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; border-width: 0px; }
        }

        .central-badge-wrapper {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 60;
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto; 
          cursor: crosshair;
        }

        .central-badge {
          position: relative;
          overflow: hidden;
          background-color: #C8924A; /* crema base */
          border-radius: 50%;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.2);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-ripple {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          border: 1px solid rgba(200, 146, 74, 0.8);
          border-radius: 50%;
          pointer-events: none;
        }
        .badge-ripple:nth-child(1) { animation: ripple-zen 3s linear infinite; }
        .badge-ripple:nth-child(2) { animation: ripple-zen 3s linear infinite 1.5s; }

        .badge-shine {
          position: absolute;
          top: 50%; left: 50%;
          width: 250%; height: 250%;
          background: conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.7) 12%, transparent 25%);
          animation: shine-spin 4s linear infinite;
          pointer-events: none;
        }

        /* Hover Interaction Effects (Background Siblings) */
        .coffee-grid:hover .coffee-card {
          opacity: 0.3;
          transform: scale(0.95);
          filter: blur(2px);
        }

        /* Hover Interaction Effects (Focused Target) */
        .coffee-grid .coffee-card:hover {
          /* ADVANCED HOVER EXPANSION */
          transform: scale(1.15) translateZ(0); /* maintain performance fix while scaling */
          opacity: 1;
          filter: blur(0px);
          z-index: 50; /* Comes to front */
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* Hide badge ONLY when hovering a coffee card explicitly */
        .coffee-grid .coffee-card:hover ~ .central-badge-wrapper {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
          pointer-events: none;
        }

        /* FOCUS BADGE HOVER RULE: Expand badge elastically, accelerate animations */
        .central-badge-wrapper:hover .central-badge {
          transform: scale(1.15); /* Elastic bounce */
          box-shadow: inset 0 0 10px rgba(0,0,0,0.2), 0 20px 50px rgba(0,0,0,0.5);
        }
        
        .central-badge-wrapper:hover .badge-shine {
          animation-duration: 2s; /* Speed up radar */
          background: conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 15%, transparent 30%);
        }
      `}} />

      <div ref={contentRef} className="py-48 relative overflow-hidden w-full">
        {/* Background Decorative Glow */}
        <div className="bg-glow absolute top-1/2 right-[-20%] -translate-y-1/2 w-[80vw] h-[80vw] bg-crema opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7">
              <span className="connect-heading monolith text-[10px] tracking-[0.5em] mb-12 block opacity-40 uppercase text-crema">Wi-Fi Free · Connection First</span>
              <h2 className="connect-heading serif text-6xl md:text-9xl leading-[0.9] italic mb-16">
                Disconnect <br /> to <span className="not-italic text-crema">Reconnect.</span>
              </h2>
              <div className="connect-heading space-y-8">
                <p className="monolith text-lg md:text-xl max-w-xl opacity-80 leading-relaxed font-light">
                  We provide a sanctuary from the digital madness. No Wi-Fi, no distractions—just exceptional coffee, lovely staff, and the person sitting across from you.
                </p>
                <div className="flex gap-12 pt-8 border-t border-crema/10 max-w-lg">
                  <div>
                    <span className="block serif text-3xl text-crema mb-2">Since 2016</span>
                    <span className="monolith text-[8px] uppercase tracking-widest opacity-40">Drury Lane Heritage</span>
                  </div>
                  <div>
                    <span className="block serif text-3xl text-crema mb-2">#1 Cafe</span>
                    <span className="monolith text-[8px] uppercase tracking-widest opacity-40">Rated on TripAdvisor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfect Alignment Grid Layout */}
            <div className="lg:col-span-5 relative mt-32 lg:mt-0">
              {/* This wrapper receives the RAF scroll physics interpolation */}
              <div ref={gridWrapperRef} className="relative w-full max-w-[500px] mx-auto">
                <div className="coffee-grid">
                  {coffeeImages.map((src, i) => (
                    <div key={i} className="coffee-card">
                      <div 
                        className="coffee-card-inner grayscale-[30%] hover:grayscale-0 transition-[filter] duration-500 ease-out" 
                        style={{ backgroundImage: `url('${src}')` }}
                      ></div>
                    </div>
                  ))}
                  
                  {/* Central Badge Wrapper */}
                  <div className="central-badge-wrapper w-28 h-28 md:w-32 md:h-32">
                    {/* External Zen Coffee Ripples */}
                    <div className="badge-ripple"></div>
                    <div className="badge-ripple"></div>
                    
                    {/* The Badge Itself */}
                    <div className="central-badge text-roast text-center p-4">
                      {/* Sweeping Glossy Radar Shine */}
                      <div className="badge-shine"></div>
                      
                      {/* Badge Text */}
                      <span className="serif text-xs font-bold leading-tight uppercase tracking-tighter relative z-10 select-none pointer-events-none">
                        The Ritual<br />Of Coffee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionSection;

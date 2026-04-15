"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useStore } from "@/lib/store";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const NapkinGallery = () => {
  const { napkins } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Staggered reveal on scroll
      gsap.fromTo(".napkin-card", 
        { y: 100, opacity: 0, rotate: (i) => (i % 2 === 0 ? -12 : 12) },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          rotate: (i) => (i % 2 === 0 ? -2 : 2),
          stagger: 0.15,
          duration: 1.5,
          ease: "expo.out",
        }
      );

      // 2. Setup individual effects for each card
      const cards = gsap.utils.toArray(".napkin-card-wrapper") as HTMLElement[];
      cards.forEach((wrapper, i) => {
        const card = wrapper.querySelector(".napkin-card") as HTMLElement;
        const textOverlay = wrapper.querySelector(".view-text") as HTMLElement;
        
        // Continuous Floating Sway
        const floatY = 15 + Math.random() * 20;
        const floatRot = 2 + Math.random() * 3;
        
        const floatTween = gsap.to(card, {
          y: `-=${floatY}`,
          rotation: i % 2 === 0 ? `+=${floatRot}` : `-=${floatRot}`,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });

        // Magnetic & Tilt Effect
        wrapper.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = wrapper.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Magnetic pull toward mouse
          const moveX = (x - centerX) * 0.2;
          const moveY = (y - centerY) * 0.2;

          gsap.to(card, {
            x: moveX,
            y: moveY,
            rotateX: (centerY - y) / 5,
            rotateY: (x - centerX) / 5,
            duration: 0.6,
            ease: "power3.out",
            transformPerspective: 1000
          });

          // Text overlay follow
          gsap.to(textOverlay, {
            x: (x - centerX) * 0.1,
            y: (y - centerY) * 0.1,
            duration: 0.4,
            ease: "power2.out"
          });
        });

        wrapper.addEventListener("mouseenter", () => {
          floatTween.pause();
          gsap.to(card, { 
            scale: 1.1, 
            boxShadow: "0 40px 80px rgba(0,0,0,0.25)",
            zIndex: 50,
            duration: 0.5,
            ease: "power4.out"
          });
        });

        wrapper.addEventListener("mouseleave", () => {
          floatTween.play();
          gsap.to(card, { 
            scale: 1, 
            x: 0,
            y: 0,
            rotateX: 0, 
            rotateY: 0, 
            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
            zIndex: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)" 
          });
          gsap.to(textOverlay, { x: 0, y: 0, duration: 0.6 });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [napkins.length, hasMounted]);

  if (!hasMounted) return null;

  const displayNapkins = napkins.filter(n => n.status === "Published").slice(0, 4);

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-40 px-6 md:px-0">
      {displayNapkins.map((napkin) => (
        <div key={napkin.id} className="napkin-card-wrapper relative">
          <Link href="/napkin-art" className="block outline-none">
            <div 
              className="napkin-card aspect-[4/5] bg-[#f9f7f2] shadow-xl p-5 flex flex-col items-center group relative overflow-visible origin-center"
              style={{
                borderRadius: '2px',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
              }}
            >
              {/* Image Frame */}
              <div className="w-full aspect-square bg-[#eceae1] rounded-[1px] relative overflow-hidden ring-1 ring-black/5">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale-20 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  style={{ backgroundImage: `url('${napkin.image}')` }}
                ></div>
                
                {/* Modern Hover Overlay */}
                <div className="absolute inset-0 bg-roast/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="view-text flex flex-col items-center">
                    <span className="serif italic text-napkin text-xl tracking-wider mb-2 drop-shadow-lg">View Work</span>
                    <div className="w-12 h-[1px] bg-napkin/40"></div>
                  </div>
                </div>
              </div>

              {/* Metadata area (Polaroid Label) */}
              <div className="mt-8 w-full flex flex-col items-start gap-1">
                <span className="serif italic text-roast/80 text-lg leading-none">
                  {napkin.artist}
                </span>
                <div className="w-full flex justify-between items-center opacity-40 mt-2">
                  <span className="monolith text-[9px] tracking-[0.2em] uppercase">{napkin.type}</span>
                  <span className="monolith text-[9px] font-bold">#00{napkin.id}</span>
                </div>
              </div>

              {/* Decorative "Pinhole" or Clip (Optional modern touch) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-napkin border border-crema/10 shadow-inner flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-roast/20"></div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NapkinGallery;

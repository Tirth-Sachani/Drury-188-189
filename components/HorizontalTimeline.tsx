"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: "2016",
    title: "The Leap of Faith",
    description: "Founded by Cemal and Ali, two friends who quit their corporate lives to find a space where time slows down.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80"
  },
  {
    year: "2018",
    title: "A Wi-Fi Free Sanctuary",
    description: "Drury became a sanctuary for locals—a Wi-Fi-free environment designed for people to talk and reconnect.",
    image: "https://images.unsplash.com/photo-1511105612320-2e62a04dd044?auto=format&fit=crop&q=80"
  },
  {
    year: "2020",
    title: "Napkin Art Legacy",
    description: "What started as a single napkin turned into a gallery of thousands, telling the story of every guest.",
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80"
  },
  {
    year: "TODAY",
    title: "Rated Best in London",
    description: "Consistently rated the #1 cafe in London. Famous for obsessive coffee, lovely staff, and soul.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
  }
];

const HorizontalTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = sectionRef.current?.scrollWidth || 0;
      const windowWidth = window.innerWidth;
      const scrollAmount = totalWidth - windowWidth;

      gsap.to(sectionRef.current, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-roast">
      <div 
        ref={sectionRef} 
        className="flex relative h-screen w-fit flex-nowrap items-center will-change-transform"
      >
        {milestones.map((item, i) => (
          <div 
            key={i} 
            className="w-screen h-screen flex-shrink-0 flex flex-col justify-center px-12 md:px-32 relative group"
            style={{ zIndex: 10 + i }}
          >
            <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative z-10">
              <div className="order-2 md:order-1">
                <span className="monolith text-[10px] md:text-sm tracking-[0.5em] mb-8 block text-crema opacity-60 uppercase">{item.year}</span>
                <h3 className="serif text-5xl md:text-9xl italic mb-12 leading-[0.8] tracking-tighter text-napkin">
                  {item.title}
                </h3>
                <p className="monolith text-sm md:text-xl leading-relaxed opacity-40 max-w-lg font-light text-napkin">
                  {item.description}
                </p>
              </div>
              <div className="order-1 md:order-2 relative aspect-[4/5] bg-crema/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 group-hover:shadow-[0_0_50px_rgba(200,146,74,0.1)]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-roast/20 transition-opacity duration-1000 group-hover:opacity-0"></div>
              </div>
            </div>
            
            {/* Massive Background Year */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 opacity-[0.02] serif italic text-[40vw] select-none pointer-events-none text-crema">
                {item.year === "TODAY" ? "∞" : item.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalTimeline;

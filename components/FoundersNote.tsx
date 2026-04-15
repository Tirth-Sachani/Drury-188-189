"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FoundersNote = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal
      gsap.fromTo(imageRef.current, 
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );

      // Text Stagger
      gsap.from(".founder-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
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
    <section ref={containerRef} className="py-48 bg-crema/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-24 items-center">
          <div ref={imageRef} className="w-full md:w-1/3 aspect-[3/4] bg-roast/5 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000 group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-110" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')" }}
            ></div>
          </div>
          <div ref={textRef} className="w-full md:w-2/3">
            <span className="founder-reveal monolith text-[10px] tracking-[0.4em] mb-8 block opacity-40 uppercase">A Note from the Founders</span>
            <h2 className="founder-reveal serif text-5xl md:text-7xl italic mb-10 leading-tight">"We quit our 9-5 jobs to build a place <br className="hidden lg:block"/> where time slows down."</h2>
            <p className="founder-reveal monolith text-sm leading-loose opacity-60 mb-10 max-w-2xl font-light">
              Cemal and Ali founded Drury 188-189 with a simple vision: to create a sanctuary in the heart of London. A place where the coffee is obsessive, the staff are like family, and the Wi-Fi doesn't exist. Because the best conversations happen when you're truly present.
            </p>
            <div className="founder-reveal">
              <Link href="/about" className="monolith text-[10px] tracking-[0.2em] border-b border-roast py-2 hover:text-crema hover:border-crema transition-all uppercase">Our Full Story</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersNote;

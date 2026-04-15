"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ArtisanCuration = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Image
      gsap.to(".artisan-img", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Text Reveal
      gsap.from(".artisan-reveal", {
        x: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-48 bg-crema/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div ref={imageWrapperRef} className="relative aspect-[4/5] bg-roast/5 overflow-hidden group rounded-2xl">
            <div 
              className="artisan-img absolute inset-0 -top-20 -bottom-20 bg-cover bg-center transition-opacity duration-1000 group-hover:opacity-90" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-roast/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 artisan-reveal">
              <span className="monolith text-[10px] text-napkin mb-4 block tracking-[0.3em] uppercase">Signature Experience</span>
              <h4 className="serif text-4xl text-napkin italic">Baklava Pancakes</h4>
            </div>
          </div>
          
          <div className="space-y-10 artisan-reveal">
            <h2 className="serif text-6xl md:text-8xl italic leading-tight">Artisan Curation, <br /> London Soul.</h2>
            <p className="monolith leading-loose text-sm md:text-lg opacity-60 font-light max-w-xl">
              At Drury 188-189, we believe in the beauty of the slow ritual. From our award-winning Allpress Espresso to our signature Mediterranean-inspired brunch, every plate is a tribute to quality and conversation.
            </p>
            <div className="pt-6">
              <Link href="/menu" className="inline-block monolith text-[10px] tracking-[0.2em] uppercase border-b border-roast py-2 hover:text-crema hover:border-crema transition-all">
                Explore the Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanCuration;

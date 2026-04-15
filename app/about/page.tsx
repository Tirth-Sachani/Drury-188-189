"use client";
import { useLayoutEffect, useRef } from "react";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Reveal
      gsap.from(".about-reveal", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.5,
        ease: "power4.out",
      });

      // Line Reveal
      gsap.from(".about-line", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 2,
        ease: "expo.inOut",
        delay: 0.5
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-napkin text-roast overflow-x-hidden">

      <header className="pt-48 pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="about-reveal serif text-7xl md:text-9xl tracking-tight leading-none mb-12">
            A Story in <span className="italic">Every Pour.</span>
          </h1>
          <div className="about-line h-[1px] w-full bg-roast/10 mb-12"></div>
          <div className="flex flex-col md:flex-row justify-between gap-12 about-reveal">
            <p className="monolith text-[10px] tracking-[0.3em] uppercase opacity-40">Our Heritage</p>
            <p className="serif text-xl md:text-3xl max-w-xl italic opacity-80 leading-relaxed font-light">
              Drury 188-189 was born from a simple obsession: that coffee is more than caffeine—it's the soul of great conversation.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-roast">
        <div className="container mx-auto px-6 py-24 text-napkin text-center">
            <span className="monolith text-[10px] tracking-[0.5em] opacity-40 uppercase mb-8 block">The Journey</span>
            <h2 className="serif text-5xl md:text-7xl italic">Our Timeline</h2>
        </div>
        <HorizontalTimeline />
      </section>

      <section className="py-48 bg-napkin">
        <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="serif text-4xl md:text-6xl italic text-roast leading-tight mb-12">"We are more than a cafe; we are a community built one napkin at a time."</h2>
            <div className="w-24 h-1 bg-crema mx-auto mb-12"></div>
            <p className="monolith text-xs tracking-[0.2em] opacity-40 uppercase">Founded in London, 2016</p>
        </div>
      </section>

    </main>
  );
}

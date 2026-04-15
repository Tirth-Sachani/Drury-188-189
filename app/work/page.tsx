"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WorkSection = ({ 
  title, 
  italicTitle,
  description, 
  features, 
  price, 
  image, 
  reversed,
  ctaText,
  ctaLink
}: { 
  title: string;
  italicTitle: string;
  description: string;
  features?: string[];
  price?: string;
  image: string;
  reversed?: boolean;
  ctaText?: string;
  ctaLink?: string;
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal
      gsap.fromTo(imageRef.current, 
        { clipPath: "inset(0% 0% 100% 0%)", scale: 1.2 },
        { 
          clipPath: "inset(0% 0% 0% 0%)", 
          scale: 1, 
          duration: 1.8, 
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );

      // Text Stagger
      gsap.from(".work-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
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
    <div ref={containerRef} className={cn("py-32 flex flex-col items-center gap-16 md:gap-24", reversed ? "md:flex-row-reverse" : "md:flex-row")}>
      <div className="w-full md:w-1/2 overflow-hidden rounded-3xl aspect-[4/5] relative group shadow-2xl">
        <img 
          ref={imageRef}
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-roast/10 group-hover:bg-transparent transition-colors duration-1000" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h2 className="serif text-5xl md:text-7xl mb-10 text-roast work-reveal">
          {title} <span className="italic">{italicTitle}</span>
        </h2>
        <p className="monolith text-sm text-roast/60 leading-relaxed mb-12 max-w-sm work-reveal">{description}</p>
        
        {price && (
          <div className="mb-12 p-8 bg-crema/10 border border-crema/20 rounded-2xl work-reveal">
            <div className="flex justify-between items-end mb-8 border-b border-roast/10 pb-6">
              <span className="monolith text-[10px] uppercase tracking-[0.3em] text-roast/40">Daily Access</span>
              <span className="serif text-4xl text-roast">{price}</span>
            </div>
            <ul className="grid grid-cols-1 gap-4">
              {features?.map((f, i) => (
                <li key={i} className="flex items-center gap-4 monolith text-[10px] text-roast/70 uppercase tracking-widest">
                  <span className="w-1 h-1 bg-crema rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {ctaText && (
          <div className="work-reveal pt-4">
            <Link 
              href={ctaLink || "#"} 
              className="inline-block monolith text-[11px] tracking-[0.3em] uppercase px-14 py-5 bg-roast text-napkin hover:bg-crema hover:text-roast transition-all rounded-full font-bold shadow-xl"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default function WorkPage() {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-title", {
        y: 100,
        opacity: 0,
        rotate: -1,
        duration: 2,
        ease: "power4.out",
      });
      gsap.from(".work-tag", {
        y: 20,
        opacity: 0,
        delay: 0.5,
        duration: 1.5,
        ease: "power3.out",
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-napkin text-roast">
      
      <header ref={headerRef} className="pt-60 pb-20 text-center md:text-left">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="serif text-7xl md:text-[10rem] italic border-b border-roast/5 pb-12 mb-12 leading-[0.9] work-title">Work & Events.</h1>
          <p className="monolith text-[11px] tracking-[0.6em] text-roast/40 uppercase work-tag">Connection · Focus · Community</p>
        </div>
      </header>

      <section className="pb-40">
        <div className="container mx-auto px-6 max-w-6xl">
          <WorkSection 
            title="Co-working at" 
            italicTitle="Drury N4"
            description="Located in Woodberry Down, our N4 sanctuary offers a dedicated environment for deep work. A balance of natural light, reservoir views, and artisanal coffee to fuel your productivity."
            price="£17.50"
            features={[
              "Dedicated Sanctuary Desk",
              "Unlimited Allpress Coffee",
              "20% Artisan Food Discount",
              "High-Speed Connection",
              "Creative Community"
            ]}
            image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            ctaText="Join the Sanctuary"
            ctaLink="/contact"
          />

          <WorkSection 
            title="Private" 
            italicTitle="Sanctuary Events"
            description="Our mezzanine area is an elegant, elevated space available for private hire. From strategic team meetings to intimate celebrations, we curate the perfect ritual for your guests."
            image="https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80"
            ctaText="Enquire Privately"
            ctaLink="mailto:info@drury188189.co.uk"
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

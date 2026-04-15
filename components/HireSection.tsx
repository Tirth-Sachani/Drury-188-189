"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HireSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const ctx = gsap.context(() => {
      // Cinematic Title Reveal - Letter by Letter/Word
      const words = titleRef.current?.querySelectorAll(".word");
      if (words) {
        gsap.fromTo(words, 
          { y: 100, opacity: 0, rotateX: -90 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.1,
            duration: 1.5,
            ease: "expo.out",
          }
        );
      }

      // Floating Orbs Animation
      gsap.to(".hire-orb", {
        x: "random(-100, 100)",
        y: "random(-50, 50)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2,
      });

      // Magnetic Logic for Button AND Words
      const handleMouseMove = (e: MouseEvent) => {
        // Magnetic Button
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          const distance = Math.sqrt(x * x + y * y);
          if (distance < 250) {
            gsap.to(buttonRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.5 });
          } else {
            gsap.to(buttonRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
          }
        }

        // Subtle Magnetic effect for words
        if (words) {
          words.forEach((word) => {
            const rect = (word as HTMLElement).getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            const dist = Math.sqrt(x * x + y * y);
            if (dist < 150) {
              gsap.to(word, { x: x * 0.1, y: y * 0.1, duration: 0.3 });
            } else {
              gsap.to(word, { x: 0, y: 0, duration: 0.5 });
            }
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, [hasMounted]);

  if (!hasMounted) return null;

  return (
    <section ref={sectionRef} className="py-48 bg-roast text-napkin relative overflow-hidden">
      {/* Unique Floating Orbs */}
      <div className="hire-orb absolute top-0 left-0 w-96 h-96 bg-crema/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="hire-orb absolute bottom-0 right-0 w-[500px] h-[500px] bg-crema/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24">
          <div className="flex-1">
            <span className="monolith text-[10px] tracking-[0.5em] mb-12 block opacity-40 uppercase">Celebrations · Meetings</span>
            <h2 ref={titleRef} className="serif text-5xl md:text-8xl mb-12 leading-[1.1] italic perspective-1000">
              <span className="word inline-block mr-4">Host</span> 
              <span className="word inline-block mr-4">your</span> 
              <br className="hidden md:block" />
              <span className="word inline-block text-crema italic not-italic font-bold animate-pulse-slow">moment</span> 
              <span className="word inline-block ml-4">with</span> 
              <span className="word inline-block ml-4">us.</span>
            </h2>
            <p className="monolith text-base opacity-60 leading-loose font-light max-w-xl">
              From intimate meetings in our N4 mezzanine to full venue takeovers in Covent Garden. Let us curate the perfect experience for your next gathering.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link 
              ref={buttonRef}
              href="/work" 
              className="inline-block monolith text-[10px] tracking-[0.4em] uppercase px-16 py-8 border border-napkin/20 hover:border-crema transition-colors rounded-full relative group overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-roast transition-colors duration-500">Explore Hire Options</span>
              <div className="absolute inset-0 bg-crema translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireSection;

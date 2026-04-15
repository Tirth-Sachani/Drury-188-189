"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RitualStep = ({ number, title, description, image, align = "left" }: { number: string, title: string, description: string, image: string, align?: "left" | "right" }) => {
  const stepRef = useRef(null);

  // Text Splitting
  const titleWords = title.split(" ");
  const descWords = description.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stepRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      });

      // 1. Stage Number fade in
      tl.from(".stage-num", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });

      // 2. Title chars staggered blur + slide left
      tl.fromTo(".title-char", {
        opacity: 0,
        x: 30,
        filter: "blur(8px)"
      }, {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        stagger: 0.05,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.2");

      // 3. Description words staggered fade from bottom-right
      tl.fromTo(".desc-word", {
        y: 15,
        x: 10,
        opacity: 0,
        rotateZ: 4
      }, {
        y: 0,
        x: 0,
        opacity: 1,
        rotateZ: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.5)"
      }, "-=0.8");

      gsap.from(".ritual-image", {
        scrollTrigger: {
          trigger: stepRef.current,
          start: "top 80%",
          scrub: 2,
        },
        scale: 1.2,
        rotate: align === "left" ? 5 : -5,
      });
    }, stepRef);
    return () => ctx.revert();
  }, [align]);

  return (
    <div ref={stepRef} className={`flex flex-col ${align === "left" ? "md:flex-row" : "md:flex-row-reverse"} gap-24 items-center mb-48`}>
      <div className="w-full md:w-1/2">
        <span className="stage-num monolith text-[10px] tracking-[0.5em] mb-8 block opacity-40 uppercase">Stage {number}</span>

        <h3 className="serif text-5xl md:text-7xl mb-10 italic flex flex-wrap gap-x-[0.3em] overflow-visible">
          {titleWords.map((word, wIdx) => (
            <span key={wIdx} className="inline-flex">
              {word.split("").map((char, cIdx) => (
                <span key={cIdx} className="title-char inline-block opacity-0">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h3>

        <p className="monolith text-sm leading-loose opacity-60 max-w-lg flex flex-wrap text-justify md:text-left">
          {descWords.map((word, i) => (
            <span key={i} className="desc-word inline-block mr-[0.4em] mb-[0.2em]">
              {word}
            </span>
          ))}
        </p>
      </div>
      <div className="w-full md:w-1/2 aspect-[4/5] bg-roast/5 rounded-2xl overflow-hidden relative ritual-image">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }}></div>
        <div className="absolute inset-0 bg-roast/10"></div>
      </div>
    </div>
  );
};

const SignatureRitual = () => {
  return (
    <section className="py-32 bg-napkin border-t border-crema/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-48">
          <h2 className="monolith text-[10px] tracking-[0.6em] mb-12 opacity-30 uppercase">The Signature Ritual</h2>
          <p className="serif text-6xl md:text-9xl tracking-tighter italic">"A journey in three acts."</p>
        </div>

        <RitualStep
          number="01"
          title="The Bean"
          description="We exclusively serve Allpress Espresso, sourced from the most vibrant high-altitude regions. Every bean is selected for its story and its soul."
          image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80"
          align="left"
        />

        <RitualStep
          number="02"
          title="The Roast"
          description="Micro-batch roasting ensures that every note of fruit, caramel, and earth is preserved. A precision craft that demands patience and obsession."
          image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
          align="right"
        />

        <RitualStep
          number="03"
          title="The Pour"
          description="Our lovely staff are trained in the art of the slow pour. No rushing, no shortcuts. Just a perfectly balanced ritual served in our Covent Garden sanctuary."
          image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80"
          align="left"
        />
      </div>
    </section>
  );
};

export default SignatureRitual;

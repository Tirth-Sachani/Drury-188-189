"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function JournalPage() {
  const { posts, isInitialized } = useStore();
  const [visibleCount, setVisibleCount] = useState(2);
  
  const ALL_PUBLISHED = posts.filter(p => p.status === "Published");
  const FEATURED_POSTS = ALL_PUBLISHED.filter(p => p.isFeatured);
  const ARCHIVE_POSTS = ALL_PUBLISHED.filter(p => !p.isFeatured);
  const VISIBLE_ARCHIVE = ARCHIVE_POSTS.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 2, ARCHIVE_POSTS.length));
  };

  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal Animation
      const heroChars = document.querySelectorAll(".hero-char");
      gsap.from(heroChars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      gsap.from(".hero-sub", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8
      });

      // 2. Layered Circular Reveal Section for Featured Posts
      if (horizontalRef.current && horizontalScrollRef.current) {
        const panels = gsap.utils.toArray(".horizontal-panel") as HTMLElement[];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${window.innerHeight * panels.length}`,
            invalidateOnRefresh: true
          }
        });

        // Initialize panels overlapping
        gsap.set(panels, { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });
        // Hide all but the first using a tiny inset
        gsap.set(panels.slice(1), { clipPath: "circle(0% at 50% 50%)" });

        panels.forEach((panel, i) => {
          if (i === 0) {
            gsap.set(panel, { zIndex: 0 });
            return;
          }
          gsap.set(panel, { zIndex: i });

          // Scale down and darken the previous panel
          tl.to(panels[i - 1], {
            scale: 0.95,
            filter: "brightness(0.4)",
            ease: "none"
          }, "reveal" + i);

          // Expand the circle to reveal the current panel
          tl.to(panel, {
            clipPath: "circle(150% at 50% 50%)",
            ease: "power2.inOut"
          }, "reveal" + i);
        });
      }

      // 3. Parallax Archive Cards
      const archiveCards = gsap.utils.toArray(".archive-card") as HTMLElement[];
      archiveCards.forEach((card, i) => {
        // Subtle move up effect for cards
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );

        // Parallax image inside the card
        const img = card.querySelector(".parallax-img");
        if (img) {
          gsap.to(img, {
            y: "20%",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

      // 4. Custom Cursor Logic for Journal Cards
      const cursor = document.querySelector(".journal-cursor");
      if (cursor) {
        const xTo = gsap.quickSetter(cursor, "x", "px");
        const yTo = gsap.quickSetter(cursor, "y", "px");

        window.addEventListener("mousemove", (e) => {
          xTo(e.clientX);
          yTo(e.clientY);
        });

        const hoverElements = document.querySelectorAll(".hover-read");
        hoverElements.forEach(el => {
          el.addEventListener("mouseenter", () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
          });
        });
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="min-h-screen bg-napkin text-roast overflow-hidden">

      {/* Custom Cursor */}
      <div className="journal-cursor fixed top-0 left-0 w-24 h-24 bg-crema text-white rounded-full flex items-center justify-center z-50 pointer-events-none opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm mix-blend-exclusion">
        <span className="monolith text-[10px] tracking-widest uppercase">Read</span>
      </div>

      {/* Hero Section */}
      <header ref={heroRef} className="pt-48 pb-32 border-b border-roast/5">
        <div className="container mx-auto px-6 text-center">
          <p className="hero-sub monolith text-[10px] tracking-[0.4em] opacity-40 uppercase mb-8">Stories · Rituals · Community</p>
          <h1 className="serif text-6xl md:text-9xl overflow-hidden flex justify-center flex-wrap">
            {"The Journal.".split("").map((char, index) => (
              <span key={index} className="hero-char inline-block" style={{ fontStyle: index > 3 ? "italic" : "normal" }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>
      </header>

      {/* Layered Reveal Featured Section */}
      <section ref={horizontalRef} className="text-napkin relative w-full h-screen overflow-hidden hidden md:block">
        <div className="absolute top-12 left-12 z-20">
          <h2 className="monolith text-[10px] tracking-[0.3em] uppercase text-white/50">Featured Stories</h2>
        </div>
        <div ref={horizontalScrollRef} className="relative h-full w-full">
          {FEATURED_POSTS.map((post, i) => (
            <div
              key={i}
              className={`horizontal-panel flex items-center justify-center p-12 lg:p-24 ${i % 2 === 0 ? 'bg-roast' : 'bg-void'}`}
            >
              <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 w-full order-2 md:order-1">
                  <div className="flex gap-4 items-center mb-6 opacity-60">
                    <span className="monolith text-[10px] uppercase tracking-wider">{post.date}</span>
                    <span className="w-1.5 h-1.5 bg-crema rounded-full"></span>
                    <span className="monolith text-[10px] uppercase tracking-wider text-crema">{post.category}</span>
                  </div>
                  <h3 className="serif text-5xl lg:text-7xl mb-8 leading-tight">{post.title}</h3>
                  <p className="monolith text-[12px] opacity-70 leading-relaxed max-w-lg mb-12">{post.excerpt}</p>
                  <Link href="/journal" className="inline-block monolith text-[10px] tracking-[0.2em] uppercase border border-napkin/20 py-4 px-8 rounded-full hover:bg-napkin hover:text-roast transition-all duration-300">
                    Read Article
                  </Link>
                </div>
                <div className="flex-1 w-full order-1 md:order-2">
                  <div className="aspect-[4/5] bg-roast/50 rounded-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${post.image}')` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Featured Section (Replacement for Horizontal Scroll on small screens) */}
      <section className="bg-roast text-napkin py-24 md:hidden">
        <div className="container mx-auto px-6">
          <h2 className="monolith text-[10px] tracking-[0.3em] uppercase opacity-50 mb-16">Featured Stories</h2>
          <div className="space-y-20">
            {FEATURED_POSTS.map((post, i) => (
              <div key={i} className="flex flex-col gap-6">
                <div className="aspect-[4/3] bg-roast/50 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${post.image}')` }}></div>
                </div>
                <div>
                  <div className="flex gap-3 items-center mb-3 opacity-60">
                    <span className="monolith text-[8px] uppercase tracking-wider">{post.date}</span>
                    <span className="w-1 h-1 bg-crema rounded-full"></span>
                    <span className="monolith text-[8px] uppercase tracking-wider text-crema">{post.category}</span>
                  </div>
                  <h3 className="serif text-3xl mb-4">{post.title}</h3>
                  <Link href="/journal" className="monolith text-[9px] tracking-[0.2em] uppercase text-crema underline underline-offset-4">Read Article</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Grid Section */}
      <section className="py-32 bg-napkin">
        <div className="container mx-auto px-6">
          <div className="mb-24 text-center max-w-2xl mx-auto">
            <h2 className="serif text-5xl mb-6">The <span className="italic text-crema">Archive</span></h2>
            <p className="monolith text-[11px] opacity-50 tracking-widest uppercase leading-relaxed">Explore past entries, musings, and the history of Drury 188-189 across the years.</p>
          </div>

          <div className="resp-grid pt-10">
            {VISIBLE_ARCHIVE.map((post, i) => (
              <Link
                href="/journal"
                key={i}
                className={`archive-card group hover-read block ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
              >
                <div className="aspect-[4/5] bg-roast/5 overflow-hidden mb-8 rounded-2xl relative">
                  {/* Parallax Container */}
                  <div className="absolute top-[-20%] left-0 w-full h-[140%]">
                    <div
                      className="parallax-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 bg-roast/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="flex gap-3 items-center mb-4 opacity-50">
                  <span className="monolith text-[9px] uppercase tracking-wider">{post.date}</span>
                  <span className="w-1 h-1 bg-crema rounded-full"></span>
                  <span className="monolith text-[9px] uppercase tracking-wider text-crema">{post.category}</span>
                </div>
                <h3 className="serif text-3xl mb-4 group-hover:text-crema transition-colors duration-300">{post.title}</h3>
                <p className="monolith text-[10px] opacity-60 leading-relaxed max-w-md">{post.excerpt}</p>
                <div className="mt-6 w-12 h-[1px] bg-roast/20 group-hover:w-full group-hover:bg-crema transition-all duration-700"></div>
              </Link>
            ))}
          </div>

          {visibleCount < ARCHIVE_POSTS.length && (
            <div className="mt-32 text-center">
              <button 
                onClick={handleLoadMore}
                className="monolith text-[10px] tracking-[0.3em] uppercase border border-roast/20 py-4 px-10 rounded-full hover:bg-roast hover:text-napkin transition-all duration-500"
              >
                Load More Stories
              </button>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}

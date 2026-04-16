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
    
    // Performance Optimization
    ScrollTrigger.config({ limitCallbacks: true });
    // Note: normalizeScroll removed — causes black screen on some browsers

    const ctx = gsap.context(() => {
      // Force 3D to prevent flicker globally
      gsap.set(".archive-card", { force3D: true });

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

      // 2. Option 3: Liquid Horizontal Drag Gallery with Velocity Skew
      if (horizontalRef.current && horizontalScrollRef.current) {
        const track = horizontalScrollRef.current;
        const cards = gsap.utils.toArray(".drag-card") as HTMLElement[];

        if (cards.length > 0) {
          // Set initial hidden state via GSAP (not inline style) so it's fully controlled
          gsap.set(cards, { opacity: 0, y: 60 });

          // Use RAF to defer measurement until AFTER the browser has fully painted the flex layout
          const initHorizontal = () => {
            ScrollTrigger.refresh();
            const totalWidth = track.scrollWidth - window.innerWidth;

            if (totalWidth <= 0) return; // Layout not ready yet, skip

            // Map vertical → horizontal
            gsap.to(track, {
              x: () => -(track.scrollWidth - window.innerWidth),
              ease: "none",
              scrollTrigger: {
                trigger: horizontalRef.current,
                pin: true,
                scrub: 1.2,
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const velocity = self.getVelocity() / 4000;
                  const skew = gsap.utils.clamp(-15, 15, velocity * 18);
                  cards.forEach((card) => {
                    const inner = card.querySelector(".drag-card-inner") as HTMLElement;
                    if (inner) {
                      gsap.to(inner, {
                        skewX: skew,
                        scale: 1 + Math.abs(velocity) * 0.03,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto",
                      });
                    }
                  });
                },
              }
            });

            // Snap back on scroll stop
            ScrollTrigger.addEventListener("scrollEnd", () => {
              cards.forEach((card) => {
                const inner = card.querySelector(".drag-card-inner") as HTMLElement;
                if (inner) {
                  gsap.to(inner, {
                    skewX: 0, scale: 1,
                    duration: 0.9,
                    ease: "elastic.out(1, 0.35)",
                    overwrite: "auto",
                  });
                }
              });
            });
          };

          // Stagger cards in first, THEN init horizontal scroll + RAIN animation
          gsap.to(cards, {
            opacity: 1, y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.2,
            onComplete: () => {
              initHorizontal();

              // === RAIN DROP TITLE ANIMATION ===
              cards.forEach((card, cardIdx) => {
                const chars = card.querySelectorAll(".drag-title-char") as NodeListOf<HTMLElement>;
                if (!chars.length) return;

                // Set all chars invisible at top before rain starts
                gsap.set(chars, { opacity: 0, y: -120, scaleY: 2.5, scaleX: 0.4, transformOrigin: "top center" });

                chars.forEach((char, ci) => {
                  // Random natural rain delay — not uniform, not too scattered
                  const rainDelay = cardIdx * 0.3 + ci * 0.055 + Math.random() * 0.08;

                  // Phase 1: FALL — fast drop with gravity feel
                  gsap.to(char, {
                    y: 0,
                    scaleY: 1,
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power3.in",  // Accelerate like gravity
                    delay: rainDelay,
                    onComplete: () => {
                      // Phase 2: IMPACT BOUNCE — elastic snap at the landing point
                      gsap.fromTo(char,
                        { scaleY: 0.5, scaleX: 1.4 },  // Squash on impact
                        {
                          scaleY: 1,
                          scaleX: 1,
                          duration: 0.45,
                          ease: "elastic.out(1.2, 0.4)",  // Bouncy rebound
                        }
                      );

                      // Phase 3: After landing — subtle continuous drip ripple loop
                      gsap.to(char, {
                        y: 3,
                        duration: 1.8 + ci * 0.035,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: 0.4 + ci * 0.04,
                      });
                    }
                  });

                  // Streak effect: a thin vertical blur as it falls
                  gsap.to(char, {
                    filter: "blur(0px)",
                    duration: 0.45,
                    delay: rainDelay,
                    ease: "power2.in",
                  });
                  gsap.set(char, { filter: "blur(2px)" });
                });

                // Hover: raindrops scatter back up (reverse rain) then fall back down
                const titleEl = card.querySelector(".drag-title");
                if (titleEl) {
                  titleEl.addEventListener("mouseenter", () => {
                    chars.forEach((char, ci) => {
                      gsap.to(char, {
                        y: -(20 + Math.random() * 30),
                        opacity: 0.4,
                        color: "#c8924a",
                        duration: 0.25 + Math.random() * 0.1,
                        ease: "power2.out",
                        delay: ci * 0.018,
                        overwrite: "auto",
                      });
                    });
                  });
                  titleEl.addEventListener("mouseleave", () => {
                    chars.forEach((char, ci) => {
                      // Re-rain them back down
                      gsap.to(char, {
                        y: 0,
                        opacity: 1,
                        color: "",
                        duration: 0.4,
                        ease: "power3.in",
                        delay: ci * 0.025,
                        overwrite: "auto",
                      });
                    });
                  });
                }
              });
            },
          });

          // Label reveal
          gsap.to(".drag-label", {
            opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.1,
          });

          // Arrow hint pulse
          gsap.to(".drag-hint-arrow", {
            x: 10, repeat: -1, yoyo: true, duration: 0.9, ease: "sine.inOut", delay: 1.2,
          });
        } else {
          gsap.to(".drag-label", { opacity: 1, duration: 0.8 });
        }
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
              toggleActions: "play none none none",
              once: true
            }
          }
        );

        // Parallax image inside the card (wrapper layer)
        const wrapper = card.querySelector(".parallax-wrapper");
        if (wrapper) {
          gsap.to(wrapper, {
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

      {/* Option 3: Liquid Horizontal Drag Gallery */}
      <section
        ref={horizontalRef}
        className="relative w-full overflow-hidden hidden md:block bg-void text-napkin"
        style={{ height: "100vh" }}
      >
        {/* Top meta strip */}
        <div className="drag-label absolute top-10 left-10 z-30 flex items-center gap-6 opacity-0">
          <span className="monolith text-[9px] tracking-[0.4em] uppercase text-white/40">Featured Stories</span>
          <span className="w-16 h-px bg-napkin/20"></span>
          <span className="monolith text-[9px] tracking-[0.3em] uppercase text-crema/50">{FEATURED_POSTS.length} Articles</span>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-10 z-30 flex items-center gap-4">
          <span className="monolith text-[8px] tracking-[0.3em] uppercase text-white/30">Scroll to explore</span>
          <span className="drag-hint-arrow text-white/30 text-lg">→</span>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-napkin/10 z-20">
          <div
            className="drag-progress h-full bg-crema origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Horizontal track — GSAP translates this element */}
        <div
          ref={horizontalScrollRef}
          className="flex h-full items-center will-change-transform"
          style={{ width: "max-content", paddingLeft: "10vw", gap: "4vw", paddingRight: "15vw" }}
        >
          {FEATURED_POSTS.map((post, i) => (
            <div
              key={i}
              className="drag-card flex-shrink-0 group cursor-pointer"
              style={{ width: "clamp(300px, 34vw, 560px)" }}
            >
              {/* Inner — receives GSAP skewX/scale on scroll velocity */}
              <div
                className="drag-card-inner relative"
                style={{ willChange: "transform" }}
              >
                {/* Image block */}
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{ height: "clamp(320px, 55vh, 560px)" }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  {/* Dark gradient bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/10 to-transparent pointer-events-none" />

                  {/* Category pill floating on image */}
                  <div className="absolute top-5 left-5">
                    <span className="monolith text-[8px] tracking-[0.3em] uppercase text-crema bg-void/60 backdrop-blur-sm py-1.5 px-3 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Index number */}
                  <div className="absolute top-5 right-5">
                    <span className="monolith text-[9px] tracking-widest text-white/30">0{i + 1}</span>
                  </div>

                  {/* Bottom caption inside image */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="monolith text-[8px] tracking-[0.2em] uppercase text-white/40">{post.date}</p>
                  </div>
                </div>

                {/* Text below image */}
                <div className="pt-6 pb-2">
                  {/* Title with character split for GSAP animation */}
                  <h3
                    className="drag-title serif mb-3 leading-tight cursor-default select-none"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", display: "flex", flexWrap: "wrap", gap: "0 0.05em" }}
                  >
                    {post.title.split("").map((char, ci) => (
                      <span
                        key={ci}
                        className="drag-title-char inline-block"
                        style={{
                          whiteSpace: char === " " ? "pre" : "normal",
                          display: "inline-block",
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </h3>
                  <p className="monolith text-[10px] opacity-50 leading-relaxed mb-5"
                    style={{ maxWidth: "42ch" }}>
                    {post.excerpt}
                  </p>

                  {/* CTA — arrow style */}
                  <Link
                    href="/journal"
                    className="inline-flex items-center gap-3 monolith text-[9px] tracking-[0.25em] uppercase group/lnk"
                  >
                    <span className="w-6 h-px bg-crema group-hover/lnk:w-12 transition-all duration-500"></span>
                    <span className="text-crema group-hover/lnk:opacity-70 transition-opacity duration-300">Read Article</span>
                  </Link>
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
                className={`archive-card group hover-read block relative ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
                style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d", willChange: "transform", transform: "translateZ(0)" }}
              >
                <div className="aspect-[4/5] bg-roast/5 overflow-hidden mb-8 rounded-2xl relative journal-image-wrapper">
                  {/* Parallax Container GSAP Layer */}
                  <div className="parallax-wrapper absolute top-[-20%] left-0 w-full h-[140%]">
                    {/* CSS Hover Scale Layer */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
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

"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const SanctuaryJournal = () => {
  const { posts } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const ctx = gsap.context(() => {
      // Heading Reveal
      gsap.from(".section-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        y: 30,
        opacity: 0,
        rotateX: -20,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2,
      });

      // Drawing Lines
      gsap.from(".draw-line", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true
        },
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.3,
      });

      // Entry Stagger
      gsap.from(".entry-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        },
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });

      // Elite Custom Cursor / Spotlight
      const cursor = document.querySelector(".sanctuary-cursor") as HTMLElement;
      if (cursor) {
        const xTo = gsap.quickSetter(cursor, "x", "px");
        const yTo = gsap.quickSetter(cursor, "y", "px");
        
        const moveCursor = (e: MouseEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hasMounted]);

  // Tilt logic - separate to avoid context issues with dynamic items
  useEffect(() => {
    if (!hasMounted) return;

    const items = sectionRef.current?.querySelectorAll(".hover-tilt");
    const handlers: { item: Element, move: any, leave: any }[] = [];

    items?.forEach((item) => {
      const move = (e: any) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(item, {
          rotateY: x * 15,
          rotateX: -y * 15,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out"
        });
      };
      const leave = () => {
        gsap.to(item, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      };

      item.addEventListener("mousemove", move);
      item.addEventListener("mouseleave", leave);
      handlers.push({ item, move, leave });
    });

    return () => {
      handlers.forEach(({ item, move, leave }) => {
        item.removeEventListener("mousemove", move);
        item.removeEventListener("mouseleave", leave);
      });
    };
  }, [hasMounted, posts]); // Re-run if posts change since items might be dynamic

  if (!hasMounted) return null;

  const featuredPosts = posts.filter(p => p.isFeatured && p.status === "Published").slice(0, 3);

  return (
    <section ref={sectionRef} className="py-32 bg-napkin border-t border-crema/10 overflow-hidden relative group/sanctuary">
      {/* Elite Custom Cursor */}
      <div className="sanctuary-cursor pointer-events-none fixed top-0 left-0 w-24 h-24 bg-crema/20 rounded-full blur-2xl z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/sanctuary:opacity-100 transition-opacity duration-500"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
          {/* Sanctuaries Column */}
          <div className="perspective-1000">
            <span className="monolith text-[10px] tracking-[0.4em] mb-12 block opacity-40 uppercase section-heading">Find Us</span>
            <h2 className="serif text-5xl md:text-7xl mb-16 section-heading">Our <span className="italic text-crema">Sanctuaries</span></h2>
            
            <div className="space-y-20">
              {[
                { 
                  name: "Covent Garden", 
                  addr: "188-189 Drury Lane, WC2B 5QD", 
                  meta: "Since 2016 • Flagship", 
                  dist: "0.2 mi from Holborn",
                  vibe: "Cozy • Historic • Lively",
                  image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80"
                },
                { 
                  name: "Drury N4", 
                  addr: "170 Riverside, N4 2GD", 
                  meta: "Co-working Hub • Mezzanine", 
                  dist: "0.4 mi from Manor House",
                  vibe: "Peaceful • Modern • Scenic",
                  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
                }
              ].map((loc, i) => (
                <div key={i} className="entry-item group relative">
                  <div className="flex gap-8 items-start relative z-10">
                    <div className="draw-line w-[1px] h-32 bg-roast/20 group-hover:bg-crema group-hover:h-48 transition-all duration-700"></div>
                    <div className="hover-tilt flex-1">
                      <div className="mb-6 flex justify-between items-start">
                        <div>
                          <h3 className="serif text-4xl mb-4 group-hover:italic transition-all">{loc.name}</h3>
                          <p className="monolith text-[10px] opacity-60 mb-2 uppercase tracking-wider">{loc.addr}</p>
                          <div className="flex gap-4 opacity-30 monolith text-[8px] uppercase tracking-tighter">
                            <span>{loc.dist}</span>
                            <span>•</span>
                            <span>{loc.vibe}</span>
                          </div>
                        </div>
                        <div className="hidden lg:block w-32 aspect-square bg-roast/5 rounded-full overflow-hidden scale-0 group-hover:scale-100 transition-transform duration-700 shadow-2xl">
                          <div className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" style={{ backgroundImage: `url('${loc.image}')` }}></div>
                        </div>
                      </div>
                      <Link href="/locations" className="inline-block monolith text-[10px] tracking-widest uppercase border-b border-roast/40 pb-1 hover:border-crema hover:text-crema transition-all">Visit Sanctuary</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Journal Column */}
          <div className="perspective-1000">
            <span className="monolith text-[10px] tracking-[0.4em] mb-12 block opacity-40 uppercase section-heading">Latest from the Journal</span>
            <h2 className="serif text-5xl md:text-7xl mb-16 section-heading">The <span className="italic text-crema">Daily</span> Grind</h2>
            
            <div className="space-y-12">
              {featuredPosts.map((post, i) => (
                <Link key={i} href="/journal" className="entry-item group block hover-tilt relative">
                  <div className="flex justify-between items-center border-b border-roast/5 pb-10 group-hover:border-crema/40 transition-colors relative z-10">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-4 opacity-40">
                        <span className="monolith text-[8px] uppercase tracking-tighter">{post.date}</span>
                        <span className="w-1 h-1 bg-crema rounded-full"></span>
                        <span className="monolith text-[8px] uppercase tracking-tighter text-crema">{post.category}</span>
                      </div>
                      <h3 className="serif text-3xl group-hover:italic transition-all leading-tight max-w-md">{post.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <span className="monolith text-[8px] opacity-20 uppercase group-hover:opacity-100 transition-opacity whitespace-nowrap">4 Min Read</span>
                       <div className="hidden md:block w-16 h-16 rounded-xl bg-roast/10 overflow-hidden group-hover:scale-125 transition-transform duration-500">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${post.image}')` }}></div>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pt-12 entry-item group">
                <Link href="/journal" className="inline-flex items-center gap-4 monolith text-[10px] tracking-[0.4em] uppercase border-b border-roast py-4 group-hover:border-crema group-hover:text-crema transition-all">
                  <span>Explore the Archive</span>
                  <span className="group-hover:translate-x-4 transition-transform duration-500">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SanctuaryJournal;

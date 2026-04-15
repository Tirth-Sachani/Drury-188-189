"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { settings } = useStore();
  const footerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();



  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main Footer Content Reveal
      gsap.from(".footer-column", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
      });

      // Massive DRURY Text Reveal Animation
      const hugeTextTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".footer-huge-text-container",
          start: "top 95%",
          toggleActions: "play none none none"
        }
      });

      hugeTextTl.to(".footer-char", {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 1.8, // Slower, more epic reveal
        ease: "expo.out" // More "liquid" feel
      });

      // Bottom Links Reveal
      hugeTextTl.from(".footer-bottom-links", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1.2");

    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="bg-napkin py-32 pb-0 border-t border-roast/10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32">
          
          {/* Brand Column */}
          <div className="md:col-span-5 footer-column">
            <h2 className="monolith text-sm mb-12 uppercase tracking-[0.4em] text-roast font-bold">{settings.studioName}</h2>
            <p className="serif text-4xl md:text-5xl italic text-roast leading-tight mb-12">
              {settings.tagline}
            </p>
            <div className="flex gap-4">
               <button onClick={scrollToTop} className="monolith text-[10px] tracking-widest uppercase border border-roast/20 rounded-full px-8 py-4 hover:bg-roast hover:text-napkin transition-all">
                  Back to Top
               </button>
            </div>
          </div>
          
          {/* Links Column 1 */}
          <div className="md:col-span-3 footer-column">
            <h3 className="monolith text-[10px] text-roast opacity-40 mb-10 uppercase tracking-[0.4em]">Navigation</h3>
            <ul className="space-y-6">
              {[
                { label: "Our Story", href: "/about" },
                { label: "The Menu", href: "/menu" },
                { label: "Sanctuaries", href: "/locations" },
                { label: "The Journal", href: "/journal" },
                { label: "Hire & Events", href: "/work" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="serif text-2xl text-roast hover:italic hover:pl-2 transition-all block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links Column 2 */}
          <div className="md:col-span-4 footer-column">
            <h3 className="monolith text-[10px] text-roast opacity-40 mb-10 uppercase tracking-[0.4em]">Connect</h3>
            <ul className="space-y-8">
              <li>
                <span className="monolith text-[8px] uppercase tracking-widest opacity-30 block mb-2">General Enquiries</span>
                <a href={`mailto:${settings.email}`} className="serif text-2xl text-roast border-b border-roast/10 hover:border-roast transition-all">
                  {settings.email}
                </a>
              </li>
              <li>
                <span className="monolith text-[8px] uppercase tracking-widest opacity-30 block mb-2">Telephone</span>
                <a href="tel:02078364381" className="serif text-2xl text-roast border-b border-roast/10 hover:border-roast transition-all">
                  020 7836 4381
                </a>
              </li>
              <li>
                <div className="flex gap-8 pt-4">
                  <a href="#" className="monolith text-[10px] tracking-widest uppercase text-roast hover:text-crema transition-colors">Instagram</a>
                  <a href="#" className="monolith text-[10px] tracking-widest uppercase text-roast hover:text-crema transition-colors">TikTok</a>
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Animated Bottom Section */}
        <div className="mt-32 pt-12 border-t border-roast/10 relative overflow-hidden flex flex-col">
          {/* Links and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-roast/60 monolith tracking-[0.4em] uppercase mb-16 footer-bottom-links z-20">
            <span>© 2026 {settings.studioName}. All Rights Reserved.</span>
            <div className="flex gap-8 items-center">
              <Link href="/privacy" className="relative group overflow-hidden inline-flex">
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[120%]">Privacy</span>
                <span className="absolute inset-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[120%] group-hover:translate-y-0 text-roast">Privacy</span>
              </Link>
              <Link href="/terms" className="relative group overflow-hidden inline-flex">
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[120%]">Terms</span>
                <span className="absolute inset-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[120%] group-hover:translate-y-0 text-roast">Terms</span>
              </Link>
              <span className="opacity-40 italic lowercase serif tracking-normal text-sm md:text-base ml-4">Built with care for London.</span>
            </div>
          </div>

          {/* Massive DRURY Text */}
          <div className="w-full flex justify-center footer-huge-text-container select-none pointer-events-none overflow-hidden pb-4">
            <h1 className="footer-huge-text text-[19vw] leading-[0.75] uppercase serif tracking-tighter text-roast m-0 p-0 flex">
              {['D', 'R', 'U', 'R', 'Y'].map((char, index) => (
                <span key={index} className="inline-block footer-char transform translate-y-[110%] opacity-0">
                  {char}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import gsap from "gsap";

const Navbar = () => {
  const { settings } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isNavbarHidden = useRef(false);
  const ticking = useRef(false);

  useEffect(() => {
    const updateNavbar = () => {
      const currentScrollY = window.scrollY;

      if (isMenuOpen) {
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;
      const SCROLL_THRESHOLD = 8;
      
      // Ignore micro scrolls (THIS FIXES BLINKING)
      if (Math.abs(diff) < SCROLL_THRESHOLD) {
        ticking.current = false;
        return;
      }

      // Scroll Down -> Hide
      if (diff > 0 && currentScrollY > 100) {
        if (!isNavbarHidden.current) {
          gsap.killTweensOf(navRef.current);
          gsap.to(navRef.current, {
            yPercent: -150,
            opacity: 0,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
          isNavbarHidden.current = true;
        }
      } 
      // Scroll Up -> Show
      else if (diff < 0) {
        if (isNavbarHidden.current) {
          gsap.killTweensOf(navRef.current);
          gsap.to(navRef.current, {
            yPercent: 0,
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
          isNavbarHidden.current = false;
        }
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && isNavbarHidden.current) {
      gsap.to(navRef.current, {
        yPercent: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });
      isNavbarHidden.current = false;
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  // Clean navigation links mapped correctly
  const navItems = [
    { name: "MENU", path: "/menu" },
    { name: "ABOUT", path: "/about" },
    { name: "LOCATIONS", path: "/locations" },
    { name: "WORK", path: "/work" },
    { name: "JOURNAL", path: "/journal" },
    { name: "NAPKIN ART", path: "/napkin-art" }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={toggleMenu}
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] transition-opacity duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      ></div>

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-[85vw] sm:w-[400px] bg-[rgba(20,20,20,0.95)] text-white z-[200] border-r border-white/10 p-10 flex flex-col justify-center transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {navItems.map((item) => (
            <div key={item.name} className="overflow-hidden">
              <Link
                href={item.path}
                onClick={toggleMenu}
                className="block font-sans text-xl sm:text-2xl font-medium text-white/80 hover:text-white transition-colors duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-10">
          <Link 
            href="/visit"
            onClick={toggleMenu}
            className="inline-block font-sans text-xs font-semibold px-8 py-3 bg-[#C8924A] text-[rgba(20,20,20,0.95)] hover:bg-[#b07d3c] hover:text-white rounded-full uppercase tracking-widest transition-colors duration-300 ease-in-out"
          >
            Visit Us
          </Link>
        </div>
      </aside>

      {/* Main Navbar */}
      <div className="fixed left-1/2 -translate-x-1/2 w-[92%] md:w-[90%] lg:w-[85%] max-w-6xl z-[100] top-6 pointer-events-none">
        <nav 
          ref={navRef}
          className={cn(
            "w-full rounded-full border border-white/10 px-6 py-3 pointer-events-auto",
            "bg-[rgba(20,20,20,0.7)] backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          )}
        >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 font-sans font-bold text-white text-lg md:text-xl uppercase tracking-[0.2em] hover:text-white/80 transition-colors duration-300 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none"
          >
            {settings.studioName || "DRURY 188-189"}
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className="font-sans text-[11px] xl:text-[12px] font-medium text-white/70 hover:text-white uppercase tracking-widest transition-colors duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/visit" 
              className="hidden sm:flex items-center justify-center font-sans text-[10px] xl:text-[11px] font-semibold px-6 py-2.5 bg-[#C8924A] text-white hover:bg-[#b07d3c] rounded-full uppercase tracking-[0.15em] transition-colors duration-300 ease-in-out whitespace-nowrap shadow-sm"
            >
              Visit Us
            </Link>

            {/* Hamburger Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className={cn(
                "w-6 h-[1.5px] bg-white transition-all duration-300 ease-in-out origin-center",
                isMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
              )}></span>
              <span className={cn(
                "w-6 h-[1.5px] bg-white transition-opacity duration-300 ease-in-out",
                isMenuOpen ? "opacity-0" : ""
              )}></span>
              <span className={cn(
                "w-6 h-[1.5px] bg-white transition-all duration-300 ease-in-out origin-center",
                isMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
              )}></span>
            </button>
          </div>
        </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

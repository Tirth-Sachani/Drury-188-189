"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import gsap from "gsap";

const Navbar = () => {
  const { settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen]);

  // GSAP Animation for Sidebar
  useEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      
      tl.to(overlayRef.current, {
        display: "block",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      tl.to(sidebarRef.current, {
        x: 0,
        duration: 0.6,
        ease: "expo.out"
      }, "-=0.3");

      tl.to(menuItemsRef.current, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.4");

    } else {
      document.body.style.overflow = "auto";
      const tl = gsap.timeline();

      tl.to(menuItemsRef.current, {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.3,
        ease: "power2.in"
      });

      tl.to(sidebarRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "expo.inOut"
      }, "-=0.2");

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = "none";
        }
      }, "-=0.3");
    }
  }, [isMenuOpen]);

  const navItems = ["Menu", "About", "Locations", "Work", "Journal", "Napkin Art"];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={toggleMenu}
        className="fixed inset-0 bg-void/60 backdrop-blur-sm z-[150] hidden opacity-0 transition-opacity"
      ></div>

      {/* Sidebar Mobile */}
      <aside 
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-[85vw] sm:w-[400px] bg-roast text-napkin z-[200] -translate-x-full border-r border-white/5 p-12 flex flex-col justify-center"
      >
        <div className="space-y-8">
          {navItems.map((item, i) => (
            <div key={item} className="sidebar-link-wrap">
              <Link
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                onClick={toggleMenu}
                ref={(el) => { menuItemsRef.current[i] = el; }}
                className="sidebar-link serif text-4xl hover:text-crema transition-colors"
              >
                {item}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-20 border-t border-white/10 pt-12">
          <p className="monolith text-[10px] opacity-40 mb-4 tracking-[0.5em]">Reach Out</p>
          <p className="serif text-xl">hello@drury188.com</p>
        </div>
      </aside>

      {/* Main Navbar */}
      <nav 
        className={cn(
          "fixed left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] z-[100] rounded-full border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled 
            ? "bg-roast/90 backdrop-blur-2xl py-3 px-6 top-6" 
            : "bg-roast/60 backdrop-blur-xl py-4 px-8 top-8",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg md:text-2xl monolith font-bold tracking-[0.2em] md:tracking-[0.3em] text-napkin uppercase truncate max-w-[150px] md:max-w-none">
            {settings.studioName}
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="monolith text-[10px] tracking-[0.2em] font-medium text-napkin/60 hover:text-napkin uppercase"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/visit" 
              className="hidden sm:block monolith text-[9px] md:text-[10px] px-6 md:px-8 py-2 md:py-3 bg-crema text-roast hover:bg-napkin font-bold rounded-full uppercase transition-colors"
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
                "w-6 h-[1.5px] bg-napkin transition-all duration-300",
                isMenuOpen && "rotate-45 translate-y-[7.5px]"
              )}></span>
              <span className={cn(
                "w-6 h-[1.5px] bg-napkin transition-all duration-300",
                isMenuOpen && "opacity-0"
              )}></span>
              <span className={cn(
                "w-6 h-[1.5px] bg-napkin transition-all duration-300",
                isMenuOpen && "-rotate-45 -translate-y-[7.5px]"
              )}></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

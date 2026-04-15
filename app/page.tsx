"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SignatureRitual from "@/components/SignatureRitual";
import FoundersNote from "@/components/FoundersNote";
import ArtisanCuration from "@/components/ArtisanCuration";
import NapkinGallery from "@/components/NapkinGallery";
import SanctuaryJournal from "@/components/SanctuaryJournal";
import HireSection from "@/components/HireSection";
import Newsletter from "@/components/Newsletter";
import ConnectionSection from "@/components/ConnectionSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after a short delay to ensure all 
    // nested client components have rendered and measured their heights.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen">
      
      <Hero />
      
      <Marquee text="RATED BEST CAFE IN LONDON • ARTISAN COFFEE • SIGNATURE NAPKIN ART • COVENT GARDEN • WOODBERRY DOWN • NO BOOKINGS • " />
      
      <div id="ritual">
        <SignatureRitual />
      </div>

      <FoundersNote />

      <ArtisanCuration />

      {/* Napkin Art Section */}
      <section className="py-48 bg-napkin border-y border-crema/10 relative overflow-hidden group">
        {/* Subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-cream-radial opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto mb-24">
            <span className="monolith text-[10px] tracking-[0.5em] opacity-40 uppercase mb-8 block">Community & Legacy</span>
            <h2 className="serif text-6xl md:text-8xl lg:text-9xl mb-12 tracking-tighter leading-tight italic">
              The <span className="not-italic">Napkin Art</span> <br /> 
              Project.
            </h2>
            <p className="monolith text-xs md:text-sm leading-[2] md:leading-[2.5] opacity-50 mb-16 max-w-2xl mx-auto px-6 uppercase tracking-widest text-justify md:text-center">
              Our walls aren't covered in wallpaper; they're covered in your stories. Over the years, our guests have turned simple napkins into a vast gallery of shared vision, humor, and heart.
            </p>
            <Link 
              href="/napkin-art" 
              className="inline-block monolith text-[11px] tracking-[0.4em] uppercase px-16 py-6 bg-roast text-napkin hover:bg-crema hover:text-roast transition-all duration-500 rounded-full shadow-2xl hover:shadow-crema/20"
            >
              Enter the Archive
            </Link>
          </div>
          
          <NapkinGallery />
        </div>
      </section>

      <SanctuaryJournal />

      <HireSection />

      <Newsletter />

      <ConnectionSection />

    </main>
  );
}

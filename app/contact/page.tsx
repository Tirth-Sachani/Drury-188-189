"use client";
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const { settings } = useStore();
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-napkin text-roast pb-0 pt-32 md:pt-40">
      <div ref={headerRef}>
        {/* Full screen hero */}
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" 
            alt="Cafe Interior" 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-napkin/40 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center text-roast px-4 fade-up">
            <h1 className="serif text-8xl md:text-[10rem] italic mb-6 tracking-tight leading-[0.9]">
              Find Your <br/> Sanctuary.
            </h1>
            <p className="monolith text-sm md:text-base opacity-80 max-w-2xl mx-auto mt-8">
              Connect with us for reservations, bespoke events, or simply to share your thoughts.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            
            {/* Left Column: Form */}
            <div className="md:col-span-7 bg-[#FDFCFB] border border-roast/10 p-8 md:p-16 fade-up">
              <h2 className="serif text-4xl mb-12">Send a Message</h2>
              <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="monolith text-[10px] uppercase tracking-widest text-roast/60 mb-3 block">Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border border-roast/10 focus:border-roast outline-none px-4 py-3 font-serif transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="monolith text-[10px] uppercase tracking-widest text-roast/60 mb-3 block">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border border-roast/10 focus:border-roast outline-none px-4 py-3 font-serif transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="monolith text-[10px] uppercase tracking-widest text-roast/60 mb-3 block">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border border-roast/10 focus:border-roast outline-none px-4 py-3 font-serif transition-colors" 
                  />
                </div>
                <div>
                  <label className="monolith text-[10px] uppercase tracking-widest text-roast/60 mb-3 block">Message</label>
                  <textarea 
                    rows={6} 
                    className="w-full bg-transparent border border-roast/10 focus:border-roast outline-none px-4 py-3 font-serif resize-none transition-colors"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#C8924A] text-white monolith text-[11px] uppercase tracking-[0.2em] px-10 py-5 hover:bg-roast transition-all mt-4 w-full md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column: Contact Info */}
            <div className="md:col-span-5 flex flex-col justify-between fade-up lg:pl-8">
              <div className="flex flex-col gap-12 border-l border-roast/20 pl-8">
                <div>
                  <h3 className="serif text-3xl italic mb-6">Covent Garden</h3>
                  <p className="font-serif text-roast/80 mb-6 leading-relaxed">
                    188-189 Drury Ln,<br/>London WC2B 5QD
                  </p>
                  <div className="space-y-3">
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4">
                      <span className="text-roast/40">📞</span> +44 20 7836 4381
                    </p>
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4 border-b border-transparent">
                      <span className="text-roast/40">🕒</span> Mon-Fri: 07:30 - 17:00
                    </p>
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4 pl-8">
                       Sat-Sun: 08:00 - 18:00
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="serif text-3xl italic mb-6">Drury N4</h3>
                  <p className="font-serif text-roast/80 mb-6 leading-relaxed">
                    170 Riverside, Woodberry Down,<br/>London N4 2GD
                  </p>
                  <div className="space-y-3">
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4">
                      <span className="text-roast/40">📞</span> +44 20 7836 4381
                    </p>
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4 border-b border-transparent">
                      <span className="text-roast/40">🕒</span> Mon-Fri: 08:00 - 16:00
                    </p>
                    <p className="monolith text-[10px] text-roast/80 flex items-center gap-4 pl-8">
                       Sat-Sun: 09:00 - 15:30
                    </p>
                  </div>
                </div>
              </div>

              {/* General Inquiries Box */}
              <div className="bg-[#EBE5D9] bg-opacity-30 border border-roast/10 p-8 mt-16 md:mt-auto">
                 <h4 className="monolith text-[10px] uppercase tracking-[0.3em] text-roast/60 mb-6">General Inquiries</h4>
                 <p className="font-serif text-roast text-sm mb-8 leading-relaxed">
                   For press inquiries or career opportunities, please reach out to <br/><a href={`mailto:${settings.email}`} className="text-[#C8924A] hover:text-roast transition-colors">{settings.email}</a>.
                 </p>
                 <div className="flex gap-4">
                   <button className="w-10 h-10 border border-roast/20 flex items-center justify-center hover:bg-roast hover:text-napkin transition-colors bg-transparent">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                   </button>
                   <button className="w-10 h-10 border border-roast/20 flex items-center justify-center hover:bg-roast hover:text-napkin transition-colors bg-transparent">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                   </button>
                   <button className="w-10 h-10 border border-roast/20 flex items-center justify-center hover:bg-roast hover:text-napkin transition-colors bg-transparent">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh] bg-roast/5 overflow-hidden fade-up">
           {/* Background Map Image */}
           <img 
             src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
             alt="Map"
             className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-40 mix-blend-multiply"
           />
           
           {/* Markers - Roughly positioned */}
           <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
              <div className="w-4 h-4 rounded-full bg-[#C8924A] border border-white shadow-md relative z-10 group-hover:scale-125 transition-transform cursor-pointer"></div>
              <div className="bg-white px-3 py-1.5 mt-2 shadow-sm pointer-events-none rounded-[2px]">
                 <span className="monolith text-[8px] uppercase tracking-widest text-roast font-bold">DRURY N4</span>
              </div>
           </div>
           
           <div className="absolute top-[45%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group mt-12 ml-16">
              <div className="w-4 h-4 rounded-full bg-[#C8924A] border border-white shadow-md relative z-10 group-hover:scale-125 transition-transform cursor-pointer"></div>
              <div className="bg-white px-3 py-1.5 mt-2 shadow-sm pointer-events-none rounded-[2px]">
                 <span className="monolith text-[8px] uppercase tracking-widest text-roast font-bold">COVENT GARDEN</span>
              </div>
           </div>

           {/* Our Urban Footprint Box */}
           <div className="absolute bottom-12 right-12 md:bottom-24 md:right-24 bg-[#FDFCFB]/95 backdrop-blur-sm p-8 md:p-12 max-w-sm border border-roast/10 z-20 shadow-sm">
              <h3 className="serif text-3xl italic mb-6">Our Urban Footprint</h3>
              <p className="font-serif text-sm text-roast/80 leading-relaxed">
                Strategically located in London's historic quarters, we offer refined escapes from the city's pulse. Use the map to navigate your way to our doorstep.
              </p>
           </div>
        </section>

      </div>
    </main>
  );
}

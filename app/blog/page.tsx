"use client";
import React from "react";

const Post = ({ title, date, excerpt, image }: { title: string, date: string, excerpt: string, image: string }) => (
  <article className="group cursor-pointer">
    <div className="aspect-[16/9] bg-oat-milk mb-8 overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      ></div>
      <div className="absolute inset-0 bg-roast/5"></div>
    </div>
    <div className="flex flex-col gap-4">
      <span className="monolith text-[8px] text-crema tracking-[0.4em] uppercase">{date}</span>
      <h3 className="serif text-3xl group-hover:italic transition-all">{title}</h3>
      <p className="monolith text-[10px] opacity-40 max-w-md leading-relaxed">{excerpt}</p>
    </div>
  </article>
);

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-napkin p-8 pt-32">
      <header className="pt-48 pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="serif text-7xl md:text-9xl mb-8 italic">The Daily Grind</h1>
          <div className="flex justify-between items-center border-t border-roast/10 pt-8">
            <p className="monolith text-[10px] tracking-[0.4em] opacity-40">Journal Entries No. 12 — 15</p>
            <div className="hidden md:block w-32 h-[1px] bg-roast/20"></div>
          </div>
        </div>
      </header>

      <section className="pb-32">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
          <Post 
            title="Sourcing the Highlands" 
            date="Dec 12, 2025" 
            excerpt="Our journey to the Sidamo province revealed more than just cherries. It revealed a legacy of soil and sun."
            image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
          />
          <Post 
            title="The Perfect Extraction" 
            date="Nov 24, 2025" 
            excerpt="Why 18 grams is the magic number for our house espresso. A scientific breakdown of flavor profiles."
            image="https://images.unsplash.com/photo-1511228539447-9ca18bb98cd1?auto=format&fit=crop&q=80"
          />
        </div>
      </section>

    </main>
  );
}

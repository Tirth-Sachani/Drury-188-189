"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function DatePicker({ 
  value, 
  onChange 
}: { 
  value: Date | null, 
  onChange: (d: Date) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPopup = () => {
    setIsOpen(true);
    if (popupRef.current) {
      gsap.fromTo(popupRef.current, 
        { y: -10, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", display: "block" }
      );
    }
  };

  const closePopup = () => {
    if (popupRef.current) {
      gsap.to(popupRef.current, {
        y: -10,
        opacity: 0,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(false);
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const numDays = daysInMonth(year, month);
  
  const days = [];
  // Empty slots for days before start of month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleSelect = (d: Date) => {
    onChange(d);
    closePopup();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Display */}
      <div 
        onClick={isOpen ? closePopup : openPopup}
        className="w-full bg-transparent py-3 text-roast border-b border-roast/20 hover:border-roast focus:border-roast transition-colors serif text-lg md:text-xl uppercase tracking-wider cursor-pointer flex justify-between items-center"
      >
        <span>
          {value ? value.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Select a Date"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {/* Popup Calendar */}
      <div 
        ref={popupRef}
        className="absolute top-full left-0 mt-2 w-72 bg-napkin border border-roast/10 shadow-2xl rounded-2xl p-5 z-50 text-roast hidden"
        style={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-roast/5 rounded-full transition-colors text-roast/50 hover:text-roast">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="serif text-lg tracking-wider bg-roast/5 px-4 py-1 rounded-full">{monthNames[month]} {year}</span>
          <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-roast/5 rounded-full transition-colors text-roast/50 hover:text-roast">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center monolith text-[8px] opacity-40 uppercase tracking-widest py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} className="p-2"></div>;
            
            const isSelected = value && d.toDateString() === value.toDateString();
            const isPast = d < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <button
                key={i}
                type="button"
                disabled={isPast}
                onClick={() => handleSelect(d)}
                className={`
                  p-2 w-full aspect-square rounded-full flex items-center justify-center monolith text-[10px] transition-all
                  ${isSelected ? 'bg-roast text-napkin scale-110 shadow-md' : ''}
                  ${!isSelected && !isPast ? 'hover:bg-roast/10 text-roast' : ''}
                  ${isPast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

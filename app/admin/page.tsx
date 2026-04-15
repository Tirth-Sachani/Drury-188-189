"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Link from "next/link";
import gsap from "gsap";

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D">("7D");
  
  // Data for the toggle animation
  const chartData = {
    "7D": [
      { label: "MON", height: 30 },
      { label: "TUE", height: 45 },
      { label: "WED", height: 55 },
      { label: "THU", height: 60 },
      { label: "FRI", height: 70, highlight: true },
      { label: "SAT", height: 75 },
      { label: "SUN", height: 85 },
    ],
    "30D": [
      { label: "WK1", height: 40 },
      { label: "WK2", height: 65 },
      { label: "WK3", height: 85, highlight: true },
      { label: "WK4", height: 60 },
    ]
  };

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Main GSAP Effects
  useEffect(() => {
    if (isInitialized && isAuthenticated && containerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. STAT COUNTERS - Number magic
        const countElements = document.querySelectorAll(".count-up");
        countElements.forEach((el) => {
          const target = parseInt(el.getAttribute("data-value") || "0");
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = Math.floor(obj.value).toLocaleString();
            },
          });
        });

        // 2. BACKGROUND WAVE - Subtle undulation
        gsap.to(".chart-bg-wave svg path", {
          d: "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113.84,5,1200,72.47V0Z",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // 3. WELCOME SEQUENCE
        tl.fromTo(".dashboard-welcome", 
          { y: 40, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power4.out" }
        );

        tl.fromTo(".stat-card", 
          { y: 60, opacity: 0, rotationX: -15 },
          { y: 0, opacity: 1, rotationX: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)" },
          "-=0.7"
        );

        tl.fromTo(".chart-section", 
          { scale: 0.98, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );

        // 4. THE LIQUID FILL (Initial)
        gsap.utils.toArray<HTMLElement>(".bar-chart-bar").forEach((bar, index) => {
          gsap.fromTo(bar, 
            { scaleY: 0 },
            { scaleY: 1, duration: 1.5, delay: 0.4 + (index * 0.08), ease: "elastic.out(1, 0.75)" }
          );
        });

        // 5. MOUSE INTERACTIVE STEAM
        const handleMouseMove = (e: MouseEvent) => {
          const steamParticles = document.querySelectorAll<HTMLElement>(".steam-particle");
          steamParticles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const dx = e.clientX - rect.left;
            const dy = e.clientY - rect.top;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 100) {
              gsap.to(particle, {
                x: dx > 0 ? -15 : 15,
                duration: 0.5,
                ease: "power2.out"
              });
            } else {
              gsap.to(particle, { x: 0, duration: 1 });
            }
          });
        };
        window.addEventListener("mousemove", handleMouseMove);

        // 6. CONTINUOUS STEAM LOOP
        gsap.utils.toArray<HTMLElement>(".steam-particle").forEach((particle, i) => {
          gsap.to(particle, {
            y: -40 - (Math.random() * 30),
            opacity: 0.6,
            scale: 2,
            duration: 2 + Math.random(),
            repeat: -1,
            delay: i * 0.4,
            ease: "power1.out",
            onRepeat: () => {
              gsap.set(particle, { opacity: 0, y: 0, x: 0, scale: 1 });
            }
          });
        });

        return () => window.removeEventListener("mousemove", handleMouseMove);
      }, containerRef);

      return () => ctx.revert();
    }
  }, [isInitialized, isAuthenticated]);

  // Data Switch Animation Trigger
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const bars = gsap.utils.toArray<HTMLElement>(".bar-chart-bar");
      gsap.fromTo(bars, 
        { scaleY: 0.8, opacity: 0.5 },
        { scaleY: 1, opacity: 1, duration: 0.8, stagger: 0.05, ease: "back.out(2)" }
      );
    }
  }, [chartPeriod]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roast/20 border-t-roast rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-roast/10">
        <div className="dashboard-welcome mb-0">
          <h2 className="mb-0">Welcome back, Curator.</h2>
          <p className="opacity-60 text-sm">The morning extraction is complete.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div 
          className="stat-card"
          onMouseMove={(e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
              rotateY: x * 0.1,
              rotateX: -y * 0.1,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)"
            });
          }}
        >
          <div className="stat-card-label">Total Revenue</div>
          <div className="stat-card-value">£<span className="count-up" data-value="42850">0</span>.00</div>
          <div className="stat-card-change positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            +12.4% from yesterday
          </div>
        </div>

        <div 
          className="stat-card"
          onMouseMove={(e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
              rotateY: x * 0.1,
              rotateX: -y * 0.1,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)"
            });
          }}
        >
          <div className="stat-card-label">Reservations</div>
          <div className="stat-card-value"><span className="count-up" data-value="184">0</span></div>
          <div className="stat-card-change positive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            84% Capacity today
          </div>
        </div>

        <div 
          className="stat-card"
          onMouseMove={(e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
              rotateY: x * 0.1,
              rotateX: -y * 0.1,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)"
            });
          }}
        >
          <div className="stat-card-label">Loyalty Members</div>
          <div className="stat-card-value"><span className="count-up" data-value="1208">0</span></div>
          <div className="stat-card-change neutral">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            +42 this week
          </div>
        </div>

        <div 
          className="stat-card"
          onMouseMove={(e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
              rotateY: x * 0.1,
              rotateX: -y * 0.1,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)"
            });
          }}
        >
          <div className="stat-card-label">Napkin Art</div>
          <div className="stat-card-value"><span className="count-up" data-value="24">0</span></div>
          <div className="stat-card-change warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            Awaiting moderation
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Chart */}
        <div className="chart-section" style={{ position: "relative", overflow: "hidden" }}>
          {/* SVG Background Wave */}
          <div className="chart-bg-wave">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "80px", opacity: 0.05, fill: "#c8924a" }}>
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
            </svg>
          </div>

          <div className="chart-header">
            <div>
              <h3>The Daily Grind</h3>
              <p>Real-time engagement frequency</p>
            </div>
            <div className="chart-toggle">
              <button 
                className={chartPeriod === "7D" ? "active" : ""} 
                onClick={() => setChartPeriod("7D")}
              >7D</button>
              <button 
                className={chartPeriod === "30D" ? "active" : ""} 
                onClick={() => setChartPeriod("30D")}
              >30D</button>
            </div>
          </div>

          <div className="bar-chart shadow-inner">
            {chartData[chartPeriod].map((day) => (
              <div className="bar-chart-col" key={day.label}>
                <div className="bar-tooltip-container">
                  <div className="bar-tooltip-header">Daily Insight</div>
                  <div className="bar-tooltip-value">{day.height}%</div>
                  <div className="bar-tooltip-footer">
                    <span className="trend-up">↑ 12%</span> vs last week
                  </div>
                </div>
                <div
                  className={`bar-chart-bar ${day.highlight ? "highlight" : ""}`}
                  style={{ height: `${day.height}%`, transformOrigin: "bottom" }}
                  onMouseEnter={(e) => {
                    const bar = e.currentTarget;
                    const col = bar.parentElement;
                    const surface = bar.querySelector(".bar-surface");
                    const tooltip = bar.parentElement?.querySelector(".bar-tooltip-container");
                    const tooltipItems = tooltip?.querySelectorAll("div");
                    
                    gsap.set(col, { zIndex: 100 });
                    gsap.to(bar, { scaleX: 1.15, brightness: 1.3, duration: 0.4, ease: "back.out(2)" });
                    if (surface) gsap.to(surface, { opacity: 1, scale: 1.2, duration: 0.3 });
                    
                    if (tooltip) {
                      gsap.to(tooltip, { opacity: 1, y: -20, scale: 1, duration: 0.4, ease: "power3.out" });
                      if (tooltipItems) {
                        gsap.fromTo(tooltipItems, 
                          { opacity: 0, x: -10 },
                          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
                        );
                      }
                    }
                    
                    // Dim others
                    const allBars = bar.closest(".bar-chart")?.querySelectorAll(".bar-chart-bar");
                    allBars?.forEach(b => {
                      if (b !== bar) gsap.to(b, { opacity: 0.4, filter: "grayscale(0.6) blur(1px)", duration: 0.4 });
                    });
                  }}
                  onMouseLeave={(e) => {
                    const bar = e.currentTarget;
                    const col = bar.parentElement;
                    const surface = bar.querySelector(".bar-surface");
                    const tooltip = bar.parentElement?.querySelector(".bar-tooltip-container");

                    gsap.set(col, { zIndex: 1 });
                    gsap.to(bar, { scaleX: 1, brightness: 1, duration: 0.4, ease: "power2.out" });
                    if (surface) gsap.to(surface, { opacity: 0.8, scale: 1, duration: 0.3 });
                    if (tooltip) gsap.to(tooltip, { opacity: 0, y: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
                    
                    // Restore others
                    const allBars = bar.closest(".bar-chart")?.querySelectorAll(".bar-chart-bar");
                    allBars?.forEach(b => gsap.to(b, { opacity: 1, filter: "grayscale(0) blur(0px)", duration: 0.4 }));
                  }}
                >
                  <div className="bar-surface" />
                  {day.highlight && (
                    <div className="steam-emitter">
                      <div className="steam-particle" />
                      <div className="steam-particle" />
                      <div className="steam-particle" />
                    </div>
                  )}
                </div>
                <span className="bar-chart-label" style={{ display: "inline-block" }}>{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", marginBottom: "20px" }}>Quick Actions</h3>
          
          <Link 
            href="/admin/menu?action=add" 
            className="quick-action-item"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
              const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
              gsap.to(e.currentTarget, { x, y, duration: 0.3, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "back.out(2)" });
            }}
          >
            <div className="quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
            </div>
            <span className="quick-action-text">Add Menu Item</span>
            <span className="quick-action-arrow">›</span>
          </Link>

          <Link 
            href="/admin/content" 
            className="quick-action-item"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
              const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
              gsap.to(e.currentTarget, { x, y, duration: 0.3, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "back.out(2)" });
            }}
          >
            <div className="quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <span className="quick-action-text">Approve Napkin Art</span>
            <span className="quick-action-arrow">›</span>
          </Link>

          <Link 
            href="/admin/settings#floor-plan" 
            className="quick-action-item"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
              const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
              gsap.to(e.currentTarget, { x, y, duration: 0.3, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "back.out(2)" });
            }}
          >
            <div className="quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </div>
            <span className="quick-action-text">Floor Plan Manager</span>
            <span className="quick-action-arrow">›</span>
          </Link>

          <div 
            className="quote-card"
            style={{ position: "relative", overflow: "hidden" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              gsap.to(e.currentTarget, {
                background: `radial-gradient(circle at ${x}px ${y}px, #faf7f2 0%, #eee8da 100%)`,
                duration: 0.4
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                background: "#faf7f2",
                duration: 0.5
              });
            }}
          >
            <p>&ldquo;A good coffee is like a good design, it requires precision, patience, and the right temperature.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

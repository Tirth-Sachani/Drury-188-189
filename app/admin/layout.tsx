"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import gsap from "gsap";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized, logout } = useStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Menu Item", message: "Curator added 'Espresso Tonic' to drinks.", time: "5m ago", unread: true },
    { id: 2, title: "Napkin Art", message: "3 new sketches pending approval.", time: "2h ago", unread: true },
    { id: 3, title: "System Update", message: "Admin dashboard updated to v2.4.", time: "1d ago", unread: false },
  ]);
  const layoutRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login/admin");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isNotificationsOpen && !(e.target as Element).closest(".notifications-wrapper")) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (isInitialized && isAuthenticated && layoutRef.current) {
      const ctx = gsap.context(() => {
        // Sidebar Entrance
        gsap.fromTo(".admin-sidebar", 
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Nav Items & Bottom Links Staggered
        gsap.fromTo([".admin-sidebar-nav a", ".admin-sidebar-bottom a", ".admin-sidebar-bottom button"], 
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
        );

        // Topbar Entrance
        gsap.fromTo(".admin-topbar", 
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
        );

        // Topbar Actions Staggered
        gsap.fromTo(".admin-topbar-actions > *", 
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)", delay: 0.5 }
        );
      }, layoutRef);

      return () => ctx.revert();
    }
  }, [isInitialized, isAuthenticated]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/inquiries", label: "Inquiries", icon: InquiryIcon },
    { href: "/admin/subscribers", label: "Subscribers", icon: MailIcon },
    { href: "/admin/menu", label: "Menu", icon: ContentIcon },
    { href: "/admin/users", label: "Users", icon: UsersIcon },
    { href: "/admin/content", label: "Content", icon: ContentIcon },
    { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
    { href: "/admin/analytics", label: "Analytics", icon: AnalyticsIcon },
  ];

  if (!hasMounted) return null;

  const getTitle = () => {
    const segments = pathname.split("/");
    const last = segments[segments.length - 1];
    if (!last || last === "admin") return "Dashboard";
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  const isActive = (href: string) => {
    if (!hasMounted) return href === "/admin";
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login/admin");
  };

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roast/20 border-t-roast rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="admin-layout" ref={layoutRef}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h1>Drury 188-189</h1>
          <span>Artisan Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-roast/10 rounded-lg text-roast/70 hover:text-roast">
            <HomeIcon />
            Back to Site
          </Link>
          <Link href="/admin/settings">
            <ProfileIcon />
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-roast/10 rounded-lg text-roast/70 hover:text-roast w-full"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <span className="admin-topbar-title">{getTitle()}</span>

          <div className="admin-topbar-search">
            <SearchIcon />
            <input type="text" placeholder="Search logs..." />
          </div>

          <div className="admin-topbar-actions">
            <Link href="/admin/users" className="admin-btn-text">Add User</Link>
            <Link href="/admin/content" className="admin-btn-primary">New Post</Link>
            
            <div className="notifications-wrapper" style={{ position: "relative" }}>
              <button 
                className="admin-topbar-icon" 
                onClick={toggleNotifications}
                style={{ position: "relative" }}
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "8px",
                    height: "8px",
                    background: "#c8924a",
                    borderRadius: "50%",
                    border: "2px solid #faf7f2"
                  }} />
                )}
              </button>

              {isNotificationsOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: "-10px",
                  width: "320px",
                  background: "#faf7f2",
                  border: "1px solid #e8e0d0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(28, 18, 8, 0.1), 0 8px 10px -6px rgba(28, 18, 8, 0.1)",
                  zIndex: 100,
                  overflow: "hidden"
                }}>
                  <div style={{ padding: "16px", borderBottom: "1px solid #e8e0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", margin: 0 }}>Activity</h4>
                    <button onClick={markAllAsRead} style={{ fontSize: "11px", color: "#c8924a", background: "none", border: "none", cursor: "pointer" }}>Mark all as read</button>
                  </div>
                  <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                    {notifications.map(notification => (
                      <div key={notification.id} style={{ 
                        padding: "12px 16px", 
                        borderBottom: "1px solid #f5f0e8",
                        background: notification.unread ? "rgba(200, 146, 74, 0.03)" : "transparent",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600, fontSize: "13px", color: "#1c1208" }}>{notification.title}</span>
                          <span style={{ fontSize: "10px", color: "#9c917b" }}>{notification.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#5c523f", lineHeight: "1.4" }}>{notification.message}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "12px", textAlign: "center", borderTop: "1px solid #e8e0d0" }}>
                    <Link 
                      href="/admin/notifications" 
                      onClick={() => setIsNotificationsOpen(false)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c8924a", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-topbar-avatar">D</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

/* ============================
   Icon Components
   ============================ */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

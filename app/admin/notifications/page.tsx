"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Filter, CheckCircle, Trash2, Clock, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  date: string;
  unread: boolean;
  type: "menu" | "content" | "system" | "user";
}

const initialNotifications: Notification[] = [
  { id: 1, title: "New Menu Item", message: "Curator added 'Espresso Tonic' to drinks category.", time: "09:45 AM", date: "Today", unread: true, type: "menu" },
  { id: 2, title: "Napkin Art", message: "3 new sketches pending approval from the community gallery.", time: "08:30 AM", date: "Today", unread: true, type: "content" },
  { id: 3, title: "System Update", message: "Admin dashboard successfully updated to v2.4. New UI features enabled.", time: "04:15 PM", date: "Yesterday", unread: false, type: "system" },
  { id: 4, title: "User Access", message: "Temporary access granted to Guest Curator for the Summer Collection.", time: "11:00 AM", date: "Yesterday", unread: false, type: "user" },
  { id: 5, title: "Peak Hours", message: "Analytics recorded 200% higher traffic during Saturday brunch.", time: "02:30 PM", date: "Mar 22", unread: false, type: "system" },
  { id: 6, title: "Stock Alert", message: "Single origin beans 'Ethopia Yirgacheffe' running low.", time: "10:15 AM", date: "Mar 21", unread: false, type: "menu" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "system">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Entrance animation
        gsap.fromTo(".filter-chip", 
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );
        gsap.fromTo(".notification-item", 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out", delay: 0.2 }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, []);

  const filteredNotifications = notifications.filter((n: Notification) => {
    if (filter === "unread") return n.unread;
    if (filter === "system") return n.type === "system";
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n: Notification) => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n: Notification) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n: Notification) => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "menu": return <Clock className="w-4 h-4 text-amber-600" />;
      case "content": return <Info className="w-4 h-4 text-blue-600" />;
      case "system": return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default: return <Bell className="w-4 h-4 text-[#9c917b]" />;
    }
  };

  return (
    <div className="notifications-container" ref={containerRef}>
      {/* Sub Header / Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            className={`filter-chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Activity
          </button>
          <button 
            className={`filter-chip ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button 
            className={`filter-chip ${filter === "system" ? "active" : ""}`}
            onClick={() => setFilter("system")}
          >
            System Alerts
          </button>
        </div>
        <button 
          onClick={markAllAsRead}
          className="admin-btn-text"
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px" }}
        >
          <CheckCircle className="w-4 h-4 text-[#c8924a]" />
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="notification-list-wrapper">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n, index) => (
            <div 
              key={n.id}
              className={`notification-item ${n.unread ? "unread" : ""}`}
            >
              <div className="notification-side-indicator">
                <div className="notification-icon-box">
                  {getTypeIcon(n.type)}
                </div>
              </div>
              
              <div className="notification-body">
                <div className="notification-header">
                  <div className="notification-titles">
                    <h4 className="notification-title">{n.title}</h4>
                    <span className="notification-time-desktop">{n.date} at {n.time}</span>
                  </div>
                </div>
                
                <p className="notification-msg">{n.message}</p>
                
                <div className="notification-footer">
                  <div className="notification-actions-row">
                    {n.unread && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="action-link"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="action-link delete"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                  <span className="notification-time-mobile">{n.date} at {n.time}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="notification-empty">
            <div className="empty-icon-circle">
              <Bell className="w-10 h-10 opacity-40" />
            </div>
            <h3>Silence in the Studio</h3>
            <p>You're all caught up with the morning extraction.</p>
            <button 
              onClick={() => setFilter("all")}
              className="admin-btn-primary" 
              style={{ marginTop: "24px", fontSize: "11px", padding: "10px 20px" }}
            >
              Back to All Activity
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .notifications-container {
          max-width: 1000px;
        }
        .notification-list-wrapper {
          background: #faf7f2;
          border: 1px solid #e8e0d0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(28, 18, 8, 0.05);
        }
        .notification-item {
          display: flex;
          padding: 24px 32px;
          border-bottom: 1px solid #f5f0e8;
          transition: all 0.2s ease;
          position: relative;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-item:hover {
          background: rgba(200, 146, 74, 0.02);
        }
        .notification-item.unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #c8924a;
        }
        .notification-item.unread {
          background: rgba(200, 146, 74, 0.04);
        }

        .notification-side-indicator {
          margin-right: 24px;
          flex-shrink: 0;
        }
        .notification-icon-box {
          width: 48px;
          height: 48px;
          background: #fff;
          border: 1px solid #e8e0d0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .notification-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .notification-header {
          margin-bottom: 6px;
        }
        .notification-titles {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .notification-title {
          margin: 0;
          font-family: var(--font-serif);
          font-size: 19px;
          font-weight: 600;
          color: #1c1208;
        }
        .notification-time-desktop {
          font-size: 11px;
          color: #9c917b;
          letter-spacing: 0.02em;
          font-weight: 500;
        }
        .notification-msg {
          margin: 0 0 16px 0;
          color: #5c523f;
          font-size: 14.5px;
          line-height: 1.6;
          max-width: 720px;
        }

        .notification-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .notification-actions-row {
          display: flex;
          gap: 20px;
        }
        .action-link {
          background: none;
          border: none;
          color: #c8924a;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .action-link:hover {
          color: #b07e3d;
          transform: translateX(2px);
        }
        .action-link.delete {
          color: #9c917b;
          font-weight: 500;
        }
        .action-link.delete:hover {
          color: #1c1208;
        }

        .notification-time-mobile {
          display: none;
          font-size: 10px;
          color: #9c917b;
        }

        .filter-chip {
          padding: 10px 22px;
          border-radius: 50px;
          border: 1px solid #e8e0d0;
          background: #fff;
          color: #7a7060;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-chip:hover {
          background: #fdfaf5;
          border-color: #c8924a;
          color: #c8924a;
        }
        .filter-chip.active {
          background: #1c1208;
          border-color: #1c1208;
          color: #fff;
          box-shadow: 0 6px 15px rgba(28, 18, 8, 0.15);
        }

        .notification-empty {
          padding: 100px 40px;
          text-align: center;
          color: #5c523f;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon-circle {
          width: 80px;
          height: 80px;
          background: #f5f0e8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #c8924a;
        }
        .notification-empty h3 {
          font-family: var(--font-serif);
          font-size: 24px;
          margin-bottom: 8px;
          color: #1c1208;
        }
        .notification-empty p {
          color: #9c917b;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .notification-time-desktop {
            display: none;
          }
          .notification-time-mobile {
            display: block;
          }
          .notification-footer {
            margin-top: 8px;
          }
          .notification-item {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import gsap from "gsap";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  message: string;
  createdAt: any;
  status: "new" | "read" | "archived";
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastInquiryId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize audio (using a subtle chime)
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
    audioRef.current.volume = 0.5;

    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];

      // Real-time notification logic
      if (isInitialized && snapshot.docs.length > inquiries.length) {
        const newDoc = snapshot.docs[0];
        if (newDoc.id !== lastInquiryId.current) {
          audioRef.current?.play().catch(e => console.log("Audio play blocked:", e));
          
          // Flash effect for the dashboard
          gsap.fromTo(".admin-topbar", 
            { backgroundColor: "rgba(200, 146, 74, 0.1)" },
            { backgroundColor: "transparent", duration: 1.5, ease: "power2.out" }
          );
        }
      }

      if (snapshot.docs.length > 0) {
        lastInquiryId.current = snapshot.docs[0].id;
      }

      setInquiries(data);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [isInitialized, inquiries.length]);

  useEffect(() => {
    if (isInitialized && containerRef.current) {
      gsap.fromTo(".inquiry-row", 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [isInitialized, inquiries.length]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "new" ? "read" : currentStatus === "read" ? "archived" : "read";
    try {
      await updateDoc(doc(db, "inquiries", id), { status: nextStatus });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      gsap.to(`.row-${id}`, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        ease: "power2.in",
        onComplete: async () => {
          await deleteDoc(doc(db, "inquiries", id));
          if (selectedInquiry?.id === id) setSelectedInquiry(null);
        }
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "read": return "bg-green-500";
      case "archived": return "bg-gray-400";
      default: return "bg-roast";
    }
  };

  return (
    <div ref={containerRef} className="editorial-section">
      <div className="editorial-header">
        <div>
          <span className="editorial-label">Inquiry System</span>
          <h3>Visitor Rituals</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-crema/10 rounded-full border border-roast/10">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="monolith text-[10px] tracking-widest text-roast/60 uppercase">Real-time Dashboard</span>
          </div>
          <span className="monolith text-[12px] text-roast/40">{inquiries.length} Inquiries</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Intent</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isInitialized ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border-2 border-roast/20 border-t-roast rounded-full animate-spin"></div>
                    <span className="monolith text-[10px] tracking-widest text-roast/40 uppercase">Awaiting messages...</span>
                  </div>
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <span className="monolith text-[10px] tracking-widest text-roast/40 uppercase italic">No inquiries yet.</span>
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr 
                  key={inq.id} 
                  className={`inquiry-row row-${inq.id} cursor-pointer hover:bg-roast/5 transition-colors ${inq.status === 'new' ? 'font-bold' : ''}`}
                  onClick={() => setSelectedInquiry(inq)}
                >
                  <td>
                    <div className="table-title">{inq.name}</div>
                    <div className="table-subtitle font-normal">{inq.email}</div>
                  </td>
                  <td>
                    <div className="monolith text-[10px] uppercase tracking-widest text-roast/60">{inq.location}</div>
                    <div className="table-subtitle font-normal italic truncate max-w-[200px]">{inq.message}</div>
                  </td>
                  <td className="table-date">{formatDate(inq.createdAt)}</td>
                  <td>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(inq.id, inq.status || "new");
                      }}
                      className={`status-badge !capitalize ${inq.status === 'new' ? 'published' : inq.status === 'read' ? 'draft' : 'archived'}`}
                    >
                      {inq.status || "new"}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInquiry(inq.id);
                        }}
                        className="table-actions hover:text-red-500 opacity-40 hover:opacity-100 transition-all"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Sidebar/Overlay */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-roast/20 backdrop-blur-sm"
            onClick={() => setSelectedInquiry(null)}
          ></div>
          <div className="relative w-full max-w-lg bg-napkin h-full shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
            <button 
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-10 right-12 text-roast hover:scale-110 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <span className="monolith text-[10px] uppercase tracking-[0.3em] text-roast/40 block mb-6">Inquiry Details</span>
            
            <h2 className="serif text-5xl mb-12">{selectedInquiry.name}</h2>

            <div className="space-y-10">
              <section>
                <label className="monolith text-[9px] uppercase tracking-widest text-roast/40 block mb-2">Ritual Intent</label>
                <div className="serif text-2xl">{selectedInquiry.location}</div>
                <div className="monolith text-xs mt-2 text-roast/60">Planned for {selectedInquiry.date ? new Date(selectedInquiry.date).toLocaleDateString() : 'Unspecified'}</div>
              </section>

              <div className="grid grid-cols-2 gap-8">
                <section>
                  <label className="monolith text-[9px] uppercase tracking-widest text-roast/40 block mb-2">Email Address</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="monolith text-sm border-b border-roast/20 hover:border-roast transition-all">{selectedInquiry.email}</a>
                </section>
                <section>
                  <label className="monolith text-[9px] uppercase tracking-widest text-roast/40 block mb-2">Phone Number</label>
                  <div className="monolith text-sm">{selectedInquiry.phone || "Not provided"}</div>
                </section>
              </div>

              <section className="bg-white/50 p-8 rounded-2xl border border-roast/5">
                <label className="monolith text-[9px] uppercase tracking-widest text-roast/40 block mb-4">Message</label>
                <p className="serif text-xl leading-relaxed text-roast/80">{selectedInquiry.message}</p>
              </section>

              <section className="pt-8 border-t border-roast/10 flex gap-4">
                <button 
                  onClick={() => {
                    toggleStatus(selectedInquiry.id, selectedInquiry.status);
                    setSelectedInquiry(null);
                  }}
                  className="admin-btn-primary flex-1"
                >
                  Mark as {selectedInquiry.status === 'new' ? 'Read' : 'New'}
                </button>
                <button 
                  onClick={() => deleteInquiry(selectedInquiry.id)}
                  className="admin-btn-text text-red-500 hover:bg-red-50"
                >
                  Delete Record
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

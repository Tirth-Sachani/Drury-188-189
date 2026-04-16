"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc, updateDoc, deleteDoc, doc, where, getDocs } from "firebase/firestore";
import gsap from "gsap";

interface Subscriber {
  id: string;
  email: string;
  createdAt: any;
  status: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastDocId = useRef<string | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.volume = 0.4;

    const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscriber[];

      // Play sound if new document added (and it's not the initial load)
      if (isInitialized && snapshot.docs.length > subscribers.length) {
        const newDoc = snapshot.docs[0];
        if (newDoc.id !== lastDocId.current) {
          audioRef.current?.play().catch(e => console.log("Audio play blocked:", e));
        }
      }

      if (snapshot.docs.length > 0) {
        lastDocId.current = snapshot.docs[0].id;
      }

      setSubscribers(data);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [isInitialized, subscribers.length]);

  useEffect(() => {
    if (isInitialized && containerRef.current) {
      gsap.fromTo(".subscriber-row", 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [isInitialized, subscribers.length]);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || isSubmitting) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    const emailTrimmed = newEmail.trim().toLowerCase();

    try {
      // Duplicate check
      const q = query(collection(db, "subscribers"), where("email", "==", emailTrimmed));
      const existing = await getDocs(q);

      if (!existing.empty) {
        setMessage({ type: "error", text: "Email already exists." });
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, "subscribers"), {
        email: emailTrimmed,
        createdAt: serverTimestamp(),
        status: "active"
      });

      setNewEmail("");
      setIsAdding(false);
      setMessage({ type: "success", text: "Joined the ritual." });
      
      // Auto-hide success message
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (error) {
      console.error("Add error:", error);
      setMessage({ type: "error", text: "Failed to add subscriber." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const docRef = doc(db, "subscribers", id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const docRef = doc(db, "subscribers", id);
      
      // Animate out before deleting
      gsap.to(`.row-${id}`, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          deleteDoc(docRef);
        }
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div ref={containerRef} className="editorial-section">
      <div className="editorial-header">
        <div>
          <span className="editorial-label">Community Growth</span>
          <h3>Ritual Subscribers</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-crema/10 rounded-full border border-roast/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="monolith text-[10px] tracking-widest text-roast/60 uppercase">Live Feed</span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="admin-btn-primary !py-2 !px-4 !text-[10px]"
          >
            {isAdding ? "Cancel" : "Add Subscriber"}
          </button>
        </div>
      </div>

      {isAdding && (
        <form 
          onSubmit={handleAddSubscriber}
          className="mb-8 p-6 bg-white/50 border border-dashed border-roast/20 rounded-xl flex items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex-1">
            <label className="monolith text-[9px] uppercase tracking-widest text-roast/40 mb-2 block">Subscriber Email</label>
            <input 
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. coffee@seeker.com"
              className="w-full bg-transparent border-b border-roast/20 py-2 monolith text-sm focus:outline-none focus:border-roast"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary !py-3 !px-8"
          >
            {isSubmitting ? "Brewing..." : "Confirm Add"}
          </button>
        </form>
      )}

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg monolith text-[10px] uppercase tracking-widest text-center ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isInitialized ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border-2 border-roast/20 border-t-roast rounded-full animate-spin"></div>
                    <span className="monolith text-[10px] tracking-widest text-roast/40 uppercase">Brewing logs...</span>
                  </div>
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <span className="monolith text-[10px] tracking-widest text-roast/40 uppercase italic">No subscribers yet. The ritual awaits.</span>
                </td>
              </tr>
            ) : (
              subscribers.map((sub, index) => (
                <tr key={sub.id} className={`subscriber-row row-${sub.id} ${index === 0 && isInitialized ? "subscriber-row-new" : ""}`}>
                  <td>
                    <div className="table-title">{sub.email}</div>
                    <div className="table-subtitle">ID: {sub.id.substring(0, 8)}...</div>
                  </td>
                  <td className="table-date">{formatDate(sub.createdAt)}</td>
                  <td>
                    <button 
                      onClick={() => toggleStatus(sub.id, sub.status || "active")}
                      className={`status-badge transition-all hover:scale-105 cursor-pointer ${sub.status === "active" ? "published" : "draft"}`}
                      title="Click to toggle status"
                    >
                      {sub.status || "active"}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => deleteSubscriber(sub.id)}
                        className="table-actions opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
                        title="Delete subscriber"
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
    </div>
  );
}


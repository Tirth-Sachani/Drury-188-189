"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore, MenuItem } from "@/lib/store";
import Link from "next/link";
import { Utensils, Grid, CheckCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MenuManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isAuthenticated, isInitialized, logout } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsModalOpen(true);
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // Dynamic category count
  const uniqueCategories = new Set(menuItems.map(item => item.category)).size;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get("name") as string,
      category: formData.get("category") as any,
      price: formData.get("price") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80",
      status: formData.get("status") as any,
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roast/20 border-t-roast rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="content-header" style={{ marginBottom: "0" }}>
          <p className="pagination-info" style={{ marginBottom: "8px", color: "#5a4a3a", fontWeight: "600", letterSpacing: "2px" }}>CATALOG MANAGEMENT</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "#1c1208" }}>
            The Culinary Offering
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            className="admin-btn-primary"
            style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "48px" }}>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="content-card" 
            style={{ padding: "32px", background: "#1c1208", position: "relative", overflow: "hidden", border: "1px solid rgba(200, 146, 74, 0.1)" }}
         >
            {/* Background Image Overlay with Less Darker Tint */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80')", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.18,
              zIndex: 0,
              filter: "brightness(1.0) contrast(1.0)"
            }}></div>
            
            <div style={{ position: "relative", zIndex: 10 }}>
              <p className="pagination-info" style={{ fontSize: "10px", color: "#c8924a", fontWeight: "600", letterSpacing: "1px" }}>TOTAL ITEMS</p>
              <h4 style={{ fontSize: "42px", fontFamily: "var(--font-serif)", marginTop: "12px", color: "#f5f2ed" }}>{menuItems.length}</h4>
            </div>
            <Utensils className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-napkin/[0.03] rotate-[15deg] z-1" />
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="content-card" 
            style={{ padding: "32px", background: "#1c1208", position: "relative", overflow: "hidden", border: "1px solid rgba(200, 146, 74, 0.1)" }}
         >
            {/* Background Image Overlay with Less Darker Tint */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80')", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.18,
              zIndex: 0,
              filter: "brightness(1.0) contrast(1.0)"
            }}></div>

            <div style={{ position: "relative", zIndex: 10 }}>
              <p className="pagination-info" style={{ fontSize: "10px", color: "#c8924a", fontWeight: "600", letterSpacing: "1px" }}>CATEGORIES</p>
              <h4 style={{ fontSize: "42px", fontFamily: "var(--font-serif)", marginTop: "12px", color: "#f5f2ed" }}>{uniqueCategories}</h4>
            </div>
            <Grid className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-napkin/[0.03] rotate-[-5deg] z-1" />
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="content-card" 
            style={{ padding: "32px", background: "#1c1208", position: "relative", overflow: "hidden", border: "1px solid rgba(200, 146, 74, 0.1)" }}
         >
            {/* Background Image Overlay with Less Darker Tint */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80')", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.18,
              zIndex: 0,
              filter: "brightness(1.0) contrast(1.0)"
            }}></div>

            <div style={{ position: "relative", zIndex: 10 }}>
              <p className="pagination-info" style={{ fontSize: "10px", color: "#c8924a", fontWeight: "600", letterSpacing: "1px" }}>PUBLISHED</p>
              <h4 style={{ fontSize: "42px", fontFamily: "var(--font-serif)", marginTop: "12px", color: "#f5f2ed" }}>{menuItems.filter(i => i.status === "Published").length}</h4>
            </div>
            <CheckCircle className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-napkin/[0.03] rotate-12 z-1" />
         </motion.div>
      </div>

      {/* Main Table Section */}
      <div style={{ background: "#fdfcf9", border: "1px solid #e8e0d0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", borderBottom: "1px solid #e8e0d0" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px" }}>Menu Items</h3>
          <button
            className="admin-btn-primary"
            style={{ padding: "8px 20px" }}
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
            Add New Item
          </button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: "24px" }}>Item Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ textAlign: "right", paddingRight: "24px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td style={{ paddingLeft: "24px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", background: "#f5f0e8" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "#9c917b", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: "12px", background: "#f5f0e8", padding: "4px 8px", borderRadius: "4px", color: "#1c1208" }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{item.price}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td className="table-actions" style={{ textAlign: "right", paddingRight: "24px" }}>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#c8924a", marginRight: "12px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Remove this item from the menu?")) deleteMenuItem(item.id);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9c917b" }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Item Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28, 18, 8, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="settings-section"
            style={{ width: "500px", background: "#f5f0e8", border: "1px solid #c8924a" }}
          >
            <h3>{editingItem ? "Edit Menu Item" : "New Menu Item"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              <div className="form-group">
                <label>Item Name</label>
                <input name="name" type="text" className="form-control" defaultValue={editingItem?.name} required />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control" defaultValue={editingItem?.category}>
                    <option value="Brunch">Brunch</option>
                    <option value="Extras">Extras</option>
                    <option value="Light Bites">Light Bites</option>
                    <option value="Eggs">Eggs</option>
                    <option value="Sweets">Sweets</option>
                    <option value="Sandwiches">Sandwiches</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                    <option value="Juices">Juices</option>
                    <option value="Smoothies">Smoothies</option>
                    <option value="Cocktails">Cocktails</option>
                    <option value="Alcohol">Alcohol</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input name="price" type="text" className="form-control" defaultValue={editingItem?.price} placeholder="e.g. £4.50" required />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" className="form-control" defaultValue={editingItem?.status}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-control" defaultValue={editingItem?.description} required rows={3} />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input name="image" type="text" className="form-control" defaultValue={editingItem?.image} placeholder="https://example.com/image.jpg" />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>
                  {editingItem ? "Save Changes" : "Add to Menu"}
                </button>
                <button
                  type="button"
                  className="admin-btn-text"
                  onClick={() => setIsModalOpen(false)}
                  style={{ border: "1px solid #e8e0d0" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "80px", paddingBottom: "40px", opacity: 0.3, display: "flex", justifyContent: "space-between" }}>
        <p className="pagination-info">CULINARY STANDARDS · V1.0.0</p>
        <p className="pagination-info">© 2024 DRURY MENU SYSTEM</p>
      </div>
    </div>
  );
}

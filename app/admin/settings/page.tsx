"use client";

import { useState, useEffect } from "react";
import { useStore, Settings } from "@/lib/store";
import { VisualEditorModal } from "@/components/VisualEditorModal";

export default function SettingsPage() {
  const { isInitialized, isAuthenticated, settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Sync local state with store settings when they arrive
  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  }, [settings, localSettings]);

  if (!isInitialized || !isAuthenticated || !localSettings) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roast/20 border-t-roast rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleInputChange = (field: keyof Settings, value: string) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };

  const handleSave = async () => {
    await updateSettings(localSettings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="users-header" style={{ marginBottom: "40px" }}>
        <div className="users-header-content">
          <p className="pagination-info" style={{ color: "#5a4a3a", fontWeight: "600", letterSpacing: "2px", marginBottom: "8px", textTransform: "uppercase", fontSize: "10px" }}>STUDIO CONFIGURATION</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "#1c1208" }}>Studio Settings</h2>
          <p style={{ color: "#5c523f", marginTop: "12px" }}>
            Configure the global parameters for Drury 188-189. These settings affect the
            public-facing website and internal administrative defaults.
          </p>
        </div>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <h3>General Configuration</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Studio Name</label>
            <input
              type="text"
              className="form-control"
              value={localSettings.studioName}
              onChange={(e) => handleInputChange("studioName", e.target.value)}
              placeholder="e.g. Drury 188-189"
            />
          </div>
          <div className="form-group">
            <label>Studio Tagline</label>
            <input
              type="text"
              className="form-control"
              value={localSettings.tagline}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
              placeholder="e.g. Artisan Coffee & Editorial Design"
            />
          </div>
          <div className="form-group full-width">
            <label>Global Description</label>
            <textarea
              className="form-control"
              value={localSettings.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter a brief description for SEO..."
            />
          </div>
        </div>
      </div>

      {/* Location Settings */}
      <div className="settings-section">
        <h3>Location &amp; Presence</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Physical Address</label>
            <input
              type="text"
              className="form-control"
              value={localSettings.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="e.g. 188-189 Drury Lane, London"
            />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              className="form-control"
              value={localSettings.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="e.g. hello@drury188.com"
            />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="settings-section">
        <h3>Operating Hours</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Weekday Hours</label>
            <input
              type="text"
              className="form-control"
              value={localSettings.weekdayHours}
              onChange={(e) => handleInputChange("weekdayHours", e.target.value)}
              placeholder="e.g. 08:00 - 18:00"
            />
          </div>
          <div className="form-group">
            <label>Weekend Hours</label>
            <input
              type="text"
              className="form-control"
              value={localSettings.weekendHours}
              onChange={(e) => handleInputChange("weekendHours", e.target.value)}
              placeholder="e.g. 09:00 - 17:00"
            />
          </div>
        </div>
      </div>

      {/* Floor Plan Manager Section */}
      <div id="floor-plan" className="settings-section" style={{ border: "1px solid #c8924a", background: "rgba(200, 146, 74, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ marginBottom: "4px" }}>Floor Plan Manager</h3>
            <p style={{ color: "#7a7060", fontSize: "13px" }}>Visualize and manage your studio layout.</p>
          </div>
          <button 
            className="admin-btn-primary" 
            style={{ padding: "8px 16px", fontSize: "11px" }}
            onClick={() => setIsEditorOpen(true)}
          >
            Launch Visual Editor
          </button>
        </div>
        <div style={{ aspectRatio: "16/9", background: "#fdfcf9", border: "1px dashed #e8e0d0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", color: "#9c917b" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>
          <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>Visual Map Loading...</span>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button className="admin-btn-primary" onClick={handleSave} style={{ padding: "12px 32px" }}>
          Save All Changes
        </button>
      </div>

      {/* Footer Branding */}
      <div
        style={{
          marginTop: "40px",
          paddingBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.3,
        }}
      >
        <div className="pagination-info">Disconnect to Reconnect · V2.4.0</div>
        <div className="admin-sidebar-logo" style={{ padding: 0 }}>
          <h1 style={{ fontSize: "18px" }}>Drury 188-189</h1>
        </div>
      </div>

      <VisualEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </div>
  );
}

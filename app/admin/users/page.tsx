"use client";

import { useState, useMemo, useEffect } from "react";

// Initial Mock Data (Moved to lib/store.tsx)

import { useStore } from "@/lib/store";

export default function UsersPage() {
  const { isInitialized, isAuthenticated, artisans, addArtisan, updateArtisan, deleteArtisan } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<any>(null);
  const itemsPerPage = 4;

  const filteredUsers = useMemo(() => {
    return artisans.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role.toUpperCase() === roleFilter;
      const matchesStatus = statusFilter === "ALL" || user.status.toUpperCase() === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [artisans, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-roast/20 border-t-roast rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handlers
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to remove this artisan?")) {
      deleteArtisan(id);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as ("Admin" | "Barista" | "Member"),
      status: "Active" as const,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      lastVisit: "Just now",
      avatar: `https://ui-avatars.com/api/?name=${formData.get("name")}&background=random`,
    };
    addArtisan(newUser);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingArtisan) return;
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as ("Admin" | "Barista" | "Member"),
      status: formData.get("status") as ("Active" | "Inactive" | "Pending"),
    };
    updateArtisan(editingArtisan.id, updates);
    setEditingArtisan(null);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <h2>Artisans &amp; Guests</h2>
          <p>
            Curate the collective of Drury 188-189. Manage the administrative roles of our
            baristas and the membership status of our most distinguished guests.
          </p>
        </div>

        {/* Highlight Card (Static Example) */}
        <div className="member-card">
          <span className="member-card-badge">Top-Tier Member</span>
          <div className="member-card-avatar">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Julian Vance"
            />
          </div>
          <div className="member-card-info">
            <div className="member-card-name">Julian Vance</div>
            <div className="member-card-visit">Last visit: 2h ago</div>
          </div>
          <div className="member-card-star">★</div>
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <div className="filter-group search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-select">
          <label>Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">ALL</option>
            <option value="ADMIN">ADMIN</option>
            <option value="BARISTA">BARISTA</option>
            <option value="MEMBER">MEMBER</option>
          </select>
        </div>

        <div className="filter-select">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        <button className="btn-reset" onClick={resetFilters}>
          Reset Filters
        </button>

        <button
          className="admin-btn-primary"
          style={{ padding: "8px 16px", marginLeft: "auto" }}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Artisan
        </button>
      </div>

      {/* Table Section */}
      <div className="editorial-section" style={{ padding: "0" }}>
        {filteredUsers.length > 0 ? (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px" }}>Name</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Last Visit</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div className="user-row-name">
                        <div className="user-avatar">
                          <img src={user.avatar} alt={user.name} />
                        </div>
                        <div>
                          <div className="user-info-name">{user.name}</div>
                          <div className="user-info-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="table-date">{user.joinDate}</td>
                    <td className="table-date">{user.lastVisit}</td>
                    <td className="table-actions" style={{ textAlign: "right", paddingRight: "32px" }}>
                      <button
                        onClick={() => setEditingArtisan(user)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9c917b", marginRight: "16px" }}
                        title="Edit Artisan"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9c917b" }}
                        title="Delete Artisan"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination" style={{ padding: "24px 32px", borderTop: "1px solid #f0ebe0" }}>
              <div className="pagination-info">
                Showing {startIndex}-{endIndex} of {filteredUsers.length} artisans
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  style={{ opacity: currentPage === 1 ? 0.3 : 1 }}
                >
                  PREV
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`pagination-btn ${p === currentPage ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}
                >
                  NEXT
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: "80px", textAlign: "center", color: "#9c917b" }}>
            <p>No artisans found matching your filters.</p>
            <button
              onClick={resetFilters}
              style={{ marginTop: "16px", textDecoration: "underline", color: "#c8924a", border: "none", background: "none", cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal Overlay */}
      {editingArtisan && (
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
            style={{ width: "400px", background: "#f5f0e8", border: "1px solid #c8924a" }}
          >
            <h3 style={{ borderBottom: "1px solid #e8e0d0" }}>Edit Artisan Profile</h3>
            <form onSubmit={handleEditUser} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  required
                  defaultValue={editingArtisan.name}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  required
                  defaultValue={editingArtisan.email}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control" defaultValue={editingArtisan.role}>
                  <option value="Barista">Barista</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" className="form-control" defaultValue={editingArtisan.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="admin-btn-text"
                  onClick={() => setEditingArtisan(null)}
                  style={{ border: "1px solid #e8e0d0" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal Overlay */}
      {isAddModalOpen && (
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
            style={{ width: "400px", background: "#f5f0e8", border: "1px solid #c8924a" }}
          >
            <h3 style={{ borderBottom: "1px solid #e8e0d0" }}>Add New Artisan</h3>
            <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" type="text" className="form-control" required placeholder="e.g. Elena Rosier" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" className="form-control" required placeholder="e.g. elena@drury188.com" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control">
                  <option value="Barista">Barista</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>
                  Create Artisan
                </button>
                <button
                  type="button"
                  className="admin-btn-text"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ border: "1px solid #e8e0d0" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}

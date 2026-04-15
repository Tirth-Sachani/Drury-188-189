"use client";

import { useState } from "react";
import { useStore, Post, Napkin } from "@/lib/store";

export default function ContentPage() {
  const { posts, napkins, addPost, updatePost, deletePost, deleteNapkin, isInitialized, isAuthenticated } = useStore();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      image: formData.get("image") as string || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80",
      status: formData.get("status") as any,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      isFeatured: formData.get("isFeatured") === "on",
    };

    if (editingPost) {
      updatePost(editingPost.id, postData);
    } else {
      addPost(postData);
    }
    setIsPostModalOpen(false);
    setEditingPost(null);
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
          <p className="pagination-info" style={{ marginBottom: "8px", color: "#5a4a3a", fontWeight: "600", letterSpacing: "2px" }}>CONTENT MANAGEMENT</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "40px", color: "#1c1208" }}>
            The Archive & Menu
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            className="admin-btn-primary"
            style={{ padding: "12px 28px" }}
            onClick={() => {
              setEditingPost(null);
              setIsPostModalOpen(true);
            }}
          >
            New Editorial Post
          </button>
        </div>
      </div>

      {/* Content Cards */}
      <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "48px" }}>
        <div className="content-card">
          <div className="content-card-img">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" alt="Home" />
            <span className="status-badge published">Published</span>
          </div>
          <div className="content-card-info">
            <h3>Home Page</h3>
            <p>Main landing experience and hero visuals.</p>
          </div>
        </div>
        <div className="content-card">
          <div className="content-card-img">
            <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80" alt="About" />
            <span className="status-badge published">Published</span>
          </div>
          <div className="content-card-info">
            <h3>About Studio</h3>
            <p>The history and ethos of Drury 188-189.</p>
          </div>
        </div>
        <div className="content-card">
          <div className="content-card-img">
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80" alt="Menu" />
            <span className="status-badge published">Published</span>
          </div>
          <div className="content-card-info">
            <h3>The Menu</h3>
            <p>Seasonal offerings and coffee rituals.</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Napkin Art & Recent Posts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        {/* Napkin Art Summary */}
        <div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", marginBottom: "20px" }}>Napkin Art</h3>
          <div className="content-card" style={{ height: "auto" }}>
            <div className="content-card-img" style={{ height: "160px" }}>
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80" alt="Napkin" />
              <span className="status-badge pending">Draft</span>
            </div>
            <div className="content-card-info">
              <p style={{ fontSize: "12px", color: "#9c917b", marginBottom: "8px" }}>LAST UPDATE: 2H AGO</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>The Gallery</span>
                <span style={{ color: "#c8924a", fontSize: "12px", cursor: "pointer" }}>VIEW ALL (12)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px" }}>The Daily Grind</h3>
            <button
              className="admin-btn-primary"
              style={{ padding: "8px 16px" }}
              onClick={() => {
                setEditingPost(null);
                setIsPostModalOpen(true);
              }}
            >
              New Post
            </button>
          </div>
          <div className="editorial-section" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "24px" }}>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right", paddingRight: "24px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ paddingLeft: "24px" }}>
                      <div style={{ fontWeight: 600 }}>{post.title}</div>
                      {post.isFeatured && (
                        <span style={{ fontSize: "10px", color: "#c8924a", textTransform: "uppercase", letterSpacing: "1px" }}>★ Featured</span>
                      )}
                    </td>
                    <td>{post.category}</td>
                    <td className="table-date">{post.date}</td>
                    <td>
                      <span className={`status-badge ${post.status.toLowerCase()}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="table-actions" style={{ textAlign: "right", paddingRight: "24px" }}>
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setIsPostModalOpen(true);
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#c8924a", marginRight: "12px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this post?")) deletePost(post.id);
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
        </div>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && (
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
            <h3>{editingPost ? "Edit Editorial Post" : "New Editorial Post"}</h3>
            <form onSubmit={handlePostSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              <div className="form-group">
                <label>Title</label>
                <input name="title" type="text" className="form-control" defaultValue={editingPost?.title} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control" defaultValue={editingPost?.category}>
                    <option value="Community">Community</option>
                    <option value="News">News</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Culinary">Culinary</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="form-control" defaultValue={editingPost?.status}>
                    <option value="Published">Published</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="image" type="text" className="form-control" defaultValue={editingPost?.image} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group">
                <label>Excerpt</label>
                <textarea name="excerpt" className="form-control" defaultValue={editingPost?.excerpt} required />
              </div>
              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "12px" }}>
                <input type="checkbox" name="isFeatured" defaultChecked={editingPost?.isFeatured} />
                <label style={{ cursor: "pointer" }}>Mark as Featured Story</label>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>
                  {editingPost ? "Save Changes" : "Create Post"}
                </button>
                <button
                  type="button"
                  className="admin-btn-text"
                  onClick={() => setIsPostModalOpen(false)}
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
        <p className="pagination-info">DISCONNECT TO RECONNECT · V2.4.0</p>
        <p className="pagination-info">© 2024 DRURY 188-189</p>
      </div>
    </div>
  );
}

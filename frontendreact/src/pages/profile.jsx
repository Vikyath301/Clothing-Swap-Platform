import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    location: "",
    profilePic: ""
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setEditForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        profilePic: res.data.profilePic || ""
      });
      // Sync localStorage user
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      showToast("Unable to load profile", "error");
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/profile", editForm);
      showToast("Profile updated successfully!", "success");
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify({ ...profile, ...res.data.user }));
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    try {
      await api.post("/logout", {});
    } catch (err) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast("Logged out successfully", "info");
    navigate("/login");
  }

  if (profile === null) {
    return (
      <div className="profile-loading">
        <p>Loading personal profile...</p>
      </div>
    );
  }

  const completedCount = profile.swapHistory?.length || 0;
  const waterSavedLiters = completedCount * 2700;
  const wasteDivertedKg = (completedCount * 0.75).toFixed(1);

  return (
    <div className="profile-page-container">
      <div className="profile-grid">
        {/* User Card */}
        <div className="profile-identity-card card-base">
          <div className="profile-avatar-wrapper">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt={profile.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
              </div>
            )}
          </div>

          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
          <span className="profile-location-chip">
            📍 {profile.location || "Location not set"}
          </span>

          <div className="profile-details-list">
            <div className="profile-detail-row">
              <span className="p-label">Phone:</span>
              <span className="p-val">{profile.phone || "Not specified"}</span>
            </div>
            <div className="profile-detail-row">
              <span className="p-label">Account Role:</span>
              <span className="p-val capitalize">Eco Swapper</span>
            </div>
          </div>

          <button
            className="btn btn-outline btn-block"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "✕ Cancel Editing" : "✏️ Edit Profile"}
          </button>

          <button className="btn btn-danger btn-block logout-action-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>

        {/* Right Column: Stats, Sustainability Impact, and Swap History */}
        <div className="profile-main-content">
          {/* Edit Form Modal/Box if toggled */}
          {isEditing && (
            <div className="edit-profile-card card-base">
              <h3>Edit Personal Profile</h3>
              <form onSubmit={handleSaveProfile} className="edit-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>City / Location (for local swaps)</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input
                    type="url"
                    value={editForm.profilePic}
                    onChange={(e) => setEditForm({ ...editForm, profilePic: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving Changes..." : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="stats-row">
            <Link to="/my-Listings" className="stat-metric-card card-base">
              <span className="metric-icon">👕</span>
              <div>
                <h4>{profile.totalListings || 0}</h4>
                <p>My Wardrobe Listings</p>
              </div>
            </Link>

            <Link to="/pendingDeals" className="stat-metric-card card-base highlight-metric">
              <span className="metric-icon">⏳</span>
              <div>
                <h4>{profile.pendingDeals || 0}</h4>
                <p>Pending Swap Deals</p>
              </div>
            </Link>

            <div className="stat-metric-card card-base">
              <span className="metric-icon">🤝</span>
              <div>
                <h4>{completedCount}</h4>
                <p>Completed Swaps</p>
              </div>
            </div>
          </div>

          {/* Sustainability Impact Meter */}
          <div className="sustainability-card card-base">
            <div className="sustainability-header">
              <span className="eco-badge">🌱 Circular Fashion Footprint</span>
              <h3>Your Environmental Impact</h3>
              <p>Direct resource conservation achieved by choosing clothes barter over fast fashion.</p>
            </div>

            <div className="eco-stats-grid">
              <div className="eco-stat-box">
                <span className="eco-number">💧 {waterSavedLiters.toLocaleString()} L</span>
                <span className="eco-desc">Freshwater Preserved</span>
              </div>
              <div className="eco-stat-box">
                <span className="eco-number">♻️ {wasteDivertedKg} kg</span>
                <span className="eco-desc">Textile Waste Diverted</span>
              </div>
              <div className="eco-stat-box">
                <span className="eco-number">✨ 100%</span>
                <span className="eco-desc">Barter Reuse Rate</span>
              </div>
            </div>
          </div>

          {/* Swap History */}
          <div className="swap-history-card card-base">
            <div className="history-header-row">
              <h3>Swap History</h3>
              <Link to="/myDeals" className="btn btn-sm btn-secondary">
                View All Deals
              </Link>
            </div>

            {profile.swapHistory?.length === 0 ? (
              <div className="empty-history-note">
                <p>No completed swaps yet. Check your pending deals or explore clothes to initiate exchanges!</p>
              </div>
            ) : (
              <div className="history-timeline">
                {profile.swapHistory.map((item) => (
                  <div className="timeline-item" key={item._id}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-users">
                        <strong>{item.customerName}</strong>
                        <span> exchanged with </span>
                        <strong>{item.ownerName}</strong>
                      </div>
                      {item.clothId && (
                        <p className="timeline-cloth">Item: {item.clothId.title || "Garment"}</p>
                      )}
                      <span className="timeline-time">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { getSocket } from "../utils/socket";
import SwapCalculatorModal from "./SwapCalculatorModal";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    fetchNotificationCount();

    const socket = getSocket();
    const handleNewNotif = (notif) => {
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("new_notification", handleNewNotif);

    return () => {
      socket.off("new_notification", handleNewNotif);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await api.get("/notifications/count");
      setNotificationCount(res.data.count || 0);
    } catch (err) {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = async (notif) => {
    try {
      await api.patch(`/notifications/${notif._id}`, {});
      setNotificationCount((prev) => Math.max(0, prev - 1));
      setShowNotifications(false);
      if (notif.clothId) {
        navigate(`/chat/${notif.clothId}`);
      } else {
        navigate("/myDeals");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout", {});
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="rewear-navbar">
        <div className="navbar-container">
          <Link to="/home" className="navbar-brand">
            <div className="brand-icon-wrapper">
              <span className="brand-icon">🌿</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">ReWear</span>
              <span className="brand-tagline">Clothing Swap</span>
            </div>
          </Link>

          <div className="navbar-links">
            <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
              Explore Wardrobe
            </Link>

            <button 
              className="nav-link nav-btn-link"
              onClick={() => setShowCalculator(true)}
            >
              ⚖️ Swap Calculator
            </button>

            <Link to="/upload" className={`nav-link ${isActive("/upload") ? "active" : ""}`}>
              ➕ List Item
            </Link>

            <Link to="/myDeals" className={`nav-link ${isActive("/myDeals") || isActive("/pendingDeals") ? "active" : ""}`}>
              🤝 My Swaps
            </Link>

            <Link to="/my-Listings" className={`nav-link ${isActive("/my-Listings") ? "active" : ""}`}>
              🏷️ My Wardrobe
            </Link>

            {user?.role === "admin" && (
              <Link to="/admin" className={`nav-link admin-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}>
                👑 Admin Portal
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <div className="notif-wrapper" ref={notifRef}>
              <button 
                className="action-icon-btn" 
                onClick={toggleNotifications}
                title="Notifications"
                aria-label="Notifications"
              >
                <span className="bell-symbol">🔔</span>
                {notificationCount > 0 && (
                  <span className="notif-pill">{notificationCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    {notificationCount > 0 && (
                      <span className="badge badge-success">{notificationCount} New</span>
                    )}
                  </div>

                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <p>No recent notifications</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item._id}
                          className={`notif-card ${!item.isRead ? "unread" : ""}`}
                          onClick={() => handleNotificationClick(item)}
                        >
                          <div className="notif-avatar">
                            {item.senderName ? item.senderName.charAt(0).toUpperCase() : "👤"}
                          </div>
                          <div className="notif-body">
                            <p className="notif-sender">{item.senderName || "System"}</p>
                            <p className="notif-msg">{item.message}</p>
                            <span className="notif-time">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {!item.isRead && <div className="unread-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper" ref={profileRef}>
              <button 
                className="profile-chip" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar-circle">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user.name} />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : "👤"}</span>
                  )}
                </div>
                <span className="chip-name">{user?.name || "My Account"}</span>
                <span className="chevron">▾</span>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <p className="dropdown-user-name">{user?.name || "Eco Swapper"}</p>
                    <p className="dropdown-user-email">{user?.email || ""}</p>
                    {user?.location && (
                      <span className="dropdown-location">📍 {user.location}</span>
                    )}
                  </div>

                  <div className="dropdown-divider" />

                  <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    👤 View Profile & Impact
                  </Link>
                  <Link to="/my-Listings" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    👕 My Clothing Listings
                  </Link>
                  <Link to="/myDeals" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    🤝 Swap Deals & Offers
                  </Link>

                  {user?.role === "admin" && (
                    <Link to="/admin" className="dropdown-item admin-item" onClick={() => setShowProfileMenu(false)}>
                      ⚙️ Admin Dashboard
                    </Link>
                  )}

                  <div className="dropdown-divider" />

                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/home" onClick={() => setMobileMenuOpen(false)}>🌿 Explore Wardrobe</Link>
            <button 
              className="mobile-menu-btn"
              onClick={() => {
                setShowCalculator(true);
                setMobileMenuOpen(false);
              }}
            >
              ⚖️ Swap Calculator
            </button>
            <Link to="/upload" onClick={() => setMobileMenuOpen(false)}>➕ List Item</Link>
            <Link to="/myDeals" onClick={() => setMobileMenuOpen(false)}>🤝 My Swaps</Link>
            <Link to="/my-Listings" onClick={() => setMobileMenuOpen(false)}>🏷️ My Wardrobe</Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>👤 Profile & Impact</Link>
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>👑 Admin Portal</Link>
            )}
            <button className="mobile-logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </div>
        )}
      </nav>

      {showCalculator && (
        <SwapCalculatorModal onClose={() => setShowCalculator(false)} />
      )}
    </>
  );
}

export default Navbar;

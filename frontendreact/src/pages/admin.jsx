import { useNavigate, Link } from "react-router-dom";
import "../css/admin.css";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <div className="admin-header-card card-base">
        <span className="admin-badge">👑 Platform Administration</span>
        <h1>Admin Operations Portal</h1>
        <p>Oversee user accounts, review listings, monitor peer-to-peer barter exchanges, and resolve disputes.</p>
      </div>

      <div className="admin-cards-grid">
        <div className="admin-menu-card card-base" onClick={() => navigate("/admin/users")}>
          <div className="admin-card-icon">👤</div>
          <h3>Manage Users</h3>
          <p>Review registered swapper accounts, inspect profiles, and delete inactive or abusive users.</p>
          <span className="card-arrow">Open User Directory ➔</span>
        </div>

        <div className="admin-menu-card card-base" onClick={() => navigate("/admin/listings")}>
          <div className="admin-card-icon">👕</div>
          <h3>Manage Listings</h3>
          <p>Inspect clothing catalog, moderate descriptions, and remove inappropriate or spam items.</p>
          <span className="card-arrow">Moderate Listings ➔</span>
        </div>

        <div className="admin-menu-card card-base" onClick={() => navigate("/admin/swaps")}>
          <div className="admin-card-icon">🔄</div>
          <h3>Swap Activities</h3>
          <p>Audit swap deal negotiations, monitor trade volumes, and track barter completion statuses.</p>
          <span className="card-arrow">Inspect Swaps ➔</span>
        </div>

        <div className="admin-menu-card card-base" onClick={() => navigate("/admin/analytics")}>
          <div className="admin-card-icon">📊</div>
          <h3>Platform Analytics</h3>
          <p>View total users, listed inventory, available stock, pending negotiations, and completed trades.</p>
          <span className="card-arrow">View Analytics ➔</span>
        </div>

        <div className="admin-menu-card card-base highlight-dispute" onClick={() => navigate("/admin/disputes")}>
          <div className="admin-card-icon">⚠️</div>
          <h3>Dispute Resolution</h3>
          <p>Review buyer/seller trade discrepancies, inspect grievance reasons, and render final decisions.</p>
          <span className="card-arrow">Review Disputes ➔</span>
        </div>
      </div>
    </div>
  );
}

export default Admin;
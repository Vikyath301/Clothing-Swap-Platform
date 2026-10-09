import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/manageDispute.css";

function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  async function fetchDisputes() {
    setLoading(true);
    try {
      const res = await api.get("/admin/disputes");
      setDisputes(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to fetch disputes", "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/admin/disputes/${id}`, { status });
      showToast(`Dispute marked as ${status}`, "success");
      fetchDisputes();
    } catch (err) {
      console.log(err);
      showToast("Unable to update dispute", "error");
    }
  }

  const filteredDisputes = disputes.filter((d) => {
    if (filter === "all") return true;
    return (d.status || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="admin-subpage-container">
      <div className="subpage-header-row">
        <div>
          <Link to="/admin" className="subpage-back-link">← Back to Admin Portal</Link>
          <h2>Dispute Resolution Center</h2>
          <p>Investigate barter grievances, quality discrepancies, or delivery issues between swappers.</p>
        </div>
        <span className="badge badge-warning">
          {disputes.filter((d) => (d.status || "").toLowerCase() === "pending").length} Pending Disputes
        </span>
      </div>

      <div className="table-controls card-base">
        <label>Status Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "auto", minWidth: "160px", marginLeft: "8px", display: "inline-block" }}
        >
          <option value="all">All Disputes ({disputes.length})</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="table-loading">
          <p>Loading dispute records...</p>
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="empty-disputes-card card-base">
          <span className="empty-icon">🛡️</span>
          <h3>No Disputes in this Category</h3>
          <p>All barter exchanges in this status are peaceful with no open escalations.</p>
        </div>
      ) : (
        <div className="disputes-list">
          {filteredDisputes.map((dispute) => {
            const isPending = (dispute.status || "").toLowerCase() === "pending";

            return (
              <div className="dispute-item-card card-base" key={dispute._id}>
                <div className="dispute-item-header">
                  <div>
                    <h4>Grievance from: <strong>{dispute.raisedByName}</strong></h4>
                    <span className="dispute-date">
                      Reported on {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      dispute.status === "Resolved"
                        ? "badge-success"
                        : dispute.status === "Rejected"
                        ? "badge-danger"
                        : "badge-warning"
                    }`}
                  >
                    {dispute.status || "Pending"}
                  </span>
                </div>

                <div className="dispute-participants-box">
                  <p>👤 <strong>Complainant:</strong> {dispute.raisedByName}</p>
                  <p>👤 <strong>Item Owner:</strong> {dispute.ownerName}</p>
                </div>

                <div className="dispute-reason-quote">
                  <span className="quote-label">Reason Stated:</span>
                  <p>"{dispute.reason}"</p>
                </div>

                {isPending && (
                  <div className="dispute-actions-row">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateStatus(dispute._id, "Resolved")}
                    >
                      ✓ Grant Resolution (Resolved)
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(dispute._id, "Rejected")}
                    >
                      ✕ Dismiss Grievance (Rejected)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDisputes;
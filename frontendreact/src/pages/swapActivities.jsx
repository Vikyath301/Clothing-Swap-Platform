import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/manageUser.css";

function SwapActivities() {
  const [swaps, setSwaps] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/swaps");
      setSwaps(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to fetch swap activities", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredSwaps = swaps.filter((s) => {
    if (filterStatus === "all") return true;
    return s.status === filterStatus;
  });

  return (
    <div className="admin-subpage-container">
      <div className="subpage-header-row">
        <div>
          <Link to="/admin" className="subpage-back-link">← Back to Admin Portal</Link>
          <h2>Monitor Swap Activities</h2>
          <p>Real-time log of all peer-to-peer barter negotiations and swap agreements.</p>
        </div>
        <span className="badge badge-brand">{swaps.length} Total Swaps Recorded</span>
      </div>

      <div className="table-controls card-base">
        <label>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: "auto", minWidth: "180px", display: "inline-block", marginLeft: "8px" }}
        >
          <option value="all">All Swap Requests</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted / Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="table-card card-base">
        {loading ? (
          <div className="table-loading">
            <p>Loading swap log...</p>
          </div>
        ) : filteredSwaps.length === 0 ? (
          <div className="table-empty">
            <p>No swap activities match the selected filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Requester</th>
                  <th>Garment Detail</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredSwaps.map((swap) => (
                  <tr key={swap._id}>
                    <td>
                      <strong>{swap.ownerName}</strong>
                    </td>
                    <td>
                      <strong>{swap.customerName}</strong>
                    </td>
                    <td>
                      <span>{swap.clothTitle || swap.clothId?.title || "Item #" + swap.clothId}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          swap.status === "accepted" || swap.status === "completed"
                            ? "badge-success"
                            : swap.status === "rejected"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {swap.status}
                      </span>
                    </td>
                    <td>
                      {new Date(swap.createdAt).toLocaleDateString()} at{" "}
                      {new Date(swap.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SwapActivities;
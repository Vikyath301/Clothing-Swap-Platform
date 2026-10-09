import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/myDeals.css";

function MyDeals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showDispute, setShowDispute] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);
    try {
      const res = await api.get("/mydeals");
      setDeals(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to load deals", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(dealId) {
    try {
      const res = await api.put(`/deal/accept/${dealId}`, {});
      showToast(res.data.message || "Deal accepted! Swap confirmed.", "success");
      fetchDeals();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to accept deal", "error");
    }
  }

  async function handleReject(dealId) {
    try {
      const res = await api.put(`/deal/reject/${dealId}`, {});
      showToast(res.data.message || "Swap request declined", "info");
      fetchDeals();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to decline deal", "error");
    }
  }

  async function raiseDispute(e) {
    e?.preventDefault();
    if (!disputeReason.trim()) {
      showToast("Please provide a reason for the dispute", "error");
      return;
    }

    setSubmittingDispute(true);
    try {
      await api.post("/dispute/create", {
        dealId: showDispute._id,
        clothId: showDispute.clothId?._id || showDispute.clothId,
        ownerId: showDispute.ownerId?._id || showDispute.ownerId,
        ownerName: showDispute.ownerName,
        reason: disputeReason.trim()
      });
      showToast("Dispute logged. Platform admin will review it.", "success");
      setShowDispute(null);
      setDisputeReason("");
    } catch (err) {
      console.log(err);
      showToast("Unable to raise dispute", "error");
    } finally {
      setSubmittingDispute(false);
    }
  }

  const isOwnerOfDeal = (deal) => {
    if (!currentUser) return false;
    const uid = currentUser.id || currentUser._id;
    const dealOwnerId = deal.ownerId?._id || deal.ownerId;
    return uid && dealOwnerId && uid.toString() === dealOwnerId.toString();
  };

  const filteredDeals = deals.filter((deal) => {
    if (activeTab === "all") return true;
    if (activeTab === "incoming") return isOwnerOfDeal(deal);
    if (activeTab === "outgoing") return !isOwnerOfDeal(deal);
    if (activeTab === "completed") return deal.status === "accepted" || deal.status === "completed";
    return true;
  });

  return (
    <div className="deals-page-wrapper">
      <div className="deals-main-container">
        <div className="deals-header-row">
          <div>
            <h2>Swap Deals & Negotiations</h2>
            <p>Track your peer-to-peer wardrobe exchange requests and confirm trades.</p>
          </div>
          <Link to="/home" className="btn btn-secondary">
            Browse More Garments
          </Link>
        </div>

        <div className="deals-tab-bar">
          <button
            className={`deal-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Swaps ({deals.length})
          </button>
          <button
            className={`deal-tab ${activeTab === "incoming" ? "active" : ""}`}
            onClick={() => setActiveTab("incoming")}
          >
            📥 Incoming Offers ({deals.filter(isOwnerOfDeal).length})
          </button>
          <button
            className={`deal-tab ${activeTab === "outgoing" ? "active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            📤 My Sent Offers ({deals.filter((d) => !isOwnerOfDeal(d)).length})
          </button>
          <button
            className={`deal-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            ✅ Confirmed Swaps ({deals.filter((d) => d.status === "accepted" || d.status === "completed").length})
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading swap activity...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="empty-deals-box card-base">
            <span className="empty-handshake">🤝</span>
            <h3>No swap deals found in this section</h3>
            <p>Explore wardrobe listings to send swap offers or list your clothes to receive incoming trade requests.</p>
            <Link to="/home" className="btn btn-primary">
              Explore Available Clothes
            </Link>
          </div>
        ) : (
          <div className="deals-cards-list">
            {filteredDeals.map((deal) => {
              const isOwner = isOwnerOfDeal(deal);
              const clothData = deal.clothId || {};
              const targetTitle = deal.clothTitle || clothData.title || "Garment";
              const targetImg = deal.clothImage || clothData.image || "/placeholder.png";

              return (
                <div className="deal-card-item card-base" key={deal._id}>
                  <div className="deal-card-header">
                    <div>
                      <span className="deal-partner-tag">
                        {isOwner
                          ? `Offer from ${deal.customerName}`
                          : `Request to ${deal.ownerName}`}
                      </span>
                      <span className="deal-date-label">
                        {new Date(deal.createdAt).toLocaleDateString()} at{" "}
                        {new Date(deal.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <span
                      className={`badge ${
                        deal.status === "accepted" || deal.status === "completed"
                          ? "badge-success"
                          : deal.status === "rejected"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {deal.status === "pending"
                        ? "🟡 Pending Approval"
                        : deal.status === "accepted" || deal.status === "completed"
                        ? "🟢 Swap Confirmed"
                        : "🔴 Declined"}
                    </span>
                  </div>

                  <div className="barter-trade-visual">
                    <div className="barter-item-side">
                      <img src={targetImg} alt={targetTitle} />
                      <div className="barter-text">
                        <span className="barter-sub">Target Item:</span>
                        <strong title={targetTitle}>{targetTitle}</strong>
                        {clothData.swapValue && (
                          <span className="pts">⚖️ {clothData.swapValue} pts</span>
                        )}
                      </div>
                    </div>

                    <div className="barter-connector">
                      <span className="exchange-arrow">⇄</span>
                      <small>Barter Swap</small>
                    </div>

                    <div className="barter-item-side">
                      {deal.offeredClothImage ? (
                        <img src={deal.offeredClothImage} alt={deal.offeredClothTitle || "Offered Garment"} />
                      ) : (
                        <div className="barter-avatar-placeholder">👕</div>
                      )}
                      <div className="barter-text">
                        <span className="barter-sub">Offered Item:</span>
                        <strong>{deal.offeredClothTitle || "Offered Exchange"}</strong>
                        <span className="barter-partner">By {deal.customerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="deal-actions-footer">
                    {/* If this is incoming pending deal to me, allow Accept / Reject */}
                    {isOwner && deal.status === "pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAccept(deal._id)}
                        >
                          ✓ Accept Swap Deal
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(deal._id)}
                        >
                          ✕ Decline Offer
                        </button>
                      </>
                    )}

                    {/* Direct link to negotiation chat */}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/chat/${clothData._id || deal.clothId}`)}
                    >
                      💬 Open Negotiation Chat
                    </button>

                    {/* Dispute option */}
                    <button
                      className="btn btn-sm btn-outline dispute-btn"
                      onClick={() => setShowDispute(deal)}
                    >
                      ⚠️ Report / Dispute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDispute && (
        <div className="modal-overlay" onClick={() => setShowDispute(null)}>
          <div className="modal-content dispute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dispute-modal-header">
              <h3>Raise a Dispute</h3>
              <button className="close-btn" onClick={() => setShowDispute(null)}>✕</button>
            </div>
            <p className="dispute-modal-sub">
              If an item arrived in incorrect condition, was not handed over, or breached barter terms, report it for admin resolution.
            </p>

            <form onSubmit={raiseDispute}>
              <div className="form-group">
                <label>Reason for Dispute *</label>
                <textarea
                  rows="4"
                  placeholder="Describe what occurred, garment discrepancy, or failure to deliver..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDispute(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={submittingDispute}
                >
                  {submittingDispute ? "Submitting..." : "Submit to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDeals;
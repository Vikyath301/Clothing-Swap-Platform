import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/myDeals.css";

function PendingDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);
    try {
      const res = await api.get("/deal/pending");
      setDeals(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to load pending requests", "error");
    } finally {
      setLoading(false);
    }
  }

  async function acceptDeal(id) {
    try {
      await api.put(`/deal/accept/${id}`, {});
      showToast("Swap request accepted! Garments marked as confirmed.", "success");
      fetchDeals();
    } catch (err) {
      showToast("Failed to accept request", "error");
    }
  }

  async function rejectDeal(id) {
    try {
      await api.put(`/deal/reject/${id}`, {});
      showToast("Swap request declined", "info");
      fetchDeals();
    } catch (err) {
      showToast("Failed to decline request", "error");
    }
  }

  return (
    <div className="deals-page-wrapper">
      <div className="deals-main-container">
        <div className="deals-header-row">
          <div>
            <h2>Pending Swap Requests</h2>
            <p>Incoming swap offers from users waiting for your decision.</p>
          </div>
          <Link to="/myDeals" className="btn btn-secondary">
            View All Swap History
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading pending deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="empty-deals-box card-base">
            <span className="empty-handshake">📬</span>
            <h3>No Pending Requests</h3>
            <p>You have responded to all incoming swap requests. Check back later or browse new clothes.</p>
            <Link to="/home" className="btn btn-primary">
              Explore Available Garments
            </Link>
          </div>
        ) : (
          <div className="deals-cards-list">
            {deals.map((deal) => {
              const clothData = deal.clothId || {};
              const targetTitle = deal.clothTitle || clothData.title || "Your Garment";
              const targetImg = deal.clothImage || clothData.image || "/placeholder.png";

              return (
                <div className="deal-card-item card-base" key={deal._id}>
                  <div className="deal-card-header">
                    <div>
                      <span className="deal-partner-tag">
                        Request from: <strong>{deal.customerName}</strong>
                      </span>
                      <span className="deal-date-label">
                        Received on {new Date(deal.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="badge badge-warning">Pending Approval</span>
                  </div>

                  <div className="barter-trade-visual">
                    <div className="barter-item-side">
                      <img src={targetImg} alt={targetTitle} />
                      <div className="barter-text">
                        <span className="barter-sub">Your Item:</span>
                        <strong>{targetTitle}</strong>
                        {clothData.swapValue && (
                          <span className="pts">⚖️ {clothData.swapValue} pts</span>
                        )}
                      </div>
                    </div>

                    <div className="barter-connector">
                      <span className="exchange-arrow">⇄</span>
                      <small>Requested Barter</small>
                    </div>

                    <div className="barter-item-side">
                      {deal.offeredClothImage ? (
                        <img src={deal.offeredClothImage} alt={deal.offeredClothTitle || "Offered Garment"} />
                      ) : (
                        <div className="barter-avatar-placeholder">👕</div>
                      )}
                      <div className="barter-text">
                        <span className="barter-sub">Offered In Return:</span>
                        <strong>{deal.offeredClothTitle || "Wardrobe Barter Offer"}</strong>
                        <span className="barter-partner">By {deal.customerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="deal-actions-footer">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => acceptDeal(deal._id)}
                    >
                      ✓ Accept Swap Request
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => rejectDeal(deal._id)}
                    >
                      ✕ Decline Request
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/chat/${clothData._id || deal.clothId}`)}
                    >
                      💬 Discuss in Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingDeals;
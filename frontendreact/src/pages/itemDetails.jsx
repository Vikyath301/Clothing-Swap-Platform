import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import SwapCalculatorModal from "../components/SwapCalculatorModal";
import "../css/itemDetails.css";

function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cloth, setCloth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {}
    }
    fetchCloth();
  }, [id]);

  const fetchCloth = async () => {
    try {
      const res = await api.get(`/item/${id}`);
      setCloth(res.data);
    } catch (err) {
      console.log(err);
      showToast("Unable to load garment details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwap = async () => {
    setRequesting(true);
    try {
      const res = await api.post("/deal/request", { clothId: cloth._id });
      showToast(res.data.message || "Swap offer sent successfully!", "success");
      navigate(`/chat/${cloth._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not request swap", "error");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading-box">
        <p>Loading clothing details...</p>
      </div>
    );
  }

  if (!cloth) {
    return (
      <div className="details-not-found">
        <h2>Garment Not Found</h2>
        <p>The clothing item might have been removed or swapped.</p>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Back to Wardrobe
        </button>
      </div>
    );
  }

  const isOwner = currentUser && (
    cloth.ownerId === currentUser.id ||
    cloth.ownerId === currentUser._id ||
    cloth.ownerId?.toString() === currentUser.id?.toString() ||
    cloth.ownerId?.toString() === currentUser._id?.toString()
  );

  return (
    <div className="item-details-page">
      <div className="details-breadcrumb">
        <button className="btn-link-back" onClick={() => navigate("/home")}>
          ← Back to Wardrobe
        </button>
      </div>

      <div className="details-card-wrapper">
        <div className="details-media-column">
          <div className="garment-main-photo">
            <img src={cloth.image} alt={cloth.title} />
            <span className={`status-badge-float ${cloth.isAvailable ? "available" : "swapped"}`}>
              {cloth.isAvailable ? "🟢 Available for Swap" : "🔴 Swapped"}
            </span>
          </div>

          <div className="eco-impact-box">
            <span className="eco-leaf">🌿</span>
            <div>
              <strong>Circular Economy Impact</strong>
              <p>
                By swapping this garment instead of buying new, you save approximately <strong>2,700 liters of water</strong> and divert textiles from landfill decomposition.
              </p>
            </div>
          </div>
        </div>

        <div className="details-info-column">
          <div className="details-header-block">
            <span className="detail-category-badge">{cloth.category}</span>
            <h1 className="detail-title">{cloth.title}</h1>
            <div className="detail-value-callout">
              <span className="value-label">Estimated Swap Value</span>
              <span className="value-points">⚖️ {cloth.swapValue} pts</span>
            </div>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Brand</span>
              <span className="spec-val">{cloth.brand}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Size</span>
              <span className="spec-val">{cloth.size}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Condition</span>
              <span className="spec-val">{cloth.condition}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Location</span>
              <span className="spec-val">📍 {cloth.location}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Owner</span>
              <span className="spec-val">👤 {cloth.ownerName}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Listed On</span>
              <span className="spec-val">
                {cloth.createdAt ? new Date(cloth.createdAt).toLocaleDateString() : "Recent"}
              </span>
            </div>
          </div>

          {cloth.description && (
            <div className="detail-description-box">
              <h3>Description & Styling Notes</h3>
              <p>{cloth.description}</p>
            </div>
          )}

          <div className="details-action-toolbar">
            {isOwner ? (
              <div className="owner-action-group">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/edit/${cloth._id}`)}
                >
                  ✏️ Edit Your Listing
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/my-Listings")}
                >
                  Manage in My Wardrobe
                </button>
              </div>
            ) : cloth.isAvailable ? (
              <div className="buyer-action-group">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate(`/chat/${cloth._id}`)}
                >
                  💬 Negotiate & Chat
                </button>

                <button
                  className="btn btn-accent"
                  onClick={() => setShowCalculator(true)}
                >
                  ⚖️ Value Parity Calculator
                </button>

                <button
                  className="btn btn-outline"
                  onClick={handleQuickSwap}
                  disabled={requesting}
                >
                  {requesting ? "Submitting..." : "🤝 Propose Swap Deal"}
                </button>
              </div>
            ) : (
              <div className="swapped-notice">
                <button className="btn btn-secondary btn-block" disabled>
                  Item is Already Swapped
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCalculator && (
        <SwapCalculatorModal
          initialTargetItem={cloth}
          onClose={() => setShowCalculator(false)}
          onSelectDeal={() => navigate(`/chat/${cloth._id}`)}
        />
      )}
    </div>
  );
}

export default ItemDetails;
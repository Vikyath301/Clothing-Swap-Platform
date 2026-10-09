import { useState, useEffect } from "react";
import api from "../utils/api";
import "./SwapCalculatorModal.css";

function SwapCalculatorModal({ initialTargetItem, onClose, onSelectDeal }) {
  const [activeTab, setActiveTab] = useState(initialTargetItem ? "compare" : "estimate");

  const [estimateData, setEstimateData] = useState({
    category: "Shirt",
    brand: "Zara",
    condition: "Excellent",
    originalPrice: ""
  });
  const [estimatedResult, setEstimatedResult] = useState(null);
  const [estimating, setEstimating] = useState(false);

  const [myItems, setMyItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState("");
  const [targetItem, setTargetItem] = useState(initialTargetItem || null);
  const [availableListings, setAvailableListings] = useState([]);
  const [selectedTargetId, setSelectedTargetId] = useState(initialTargetItem?._id || "");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchMyItems();
    if (!initialTargetItem) {
      fetchAvailableListings();
    }
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await api.get("/my-Listings");
      setMyItems(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedMyItemId(res.data[0]._id);
      }
    } catch (e) {}
  };

  const fetchAvailableListings = async () => {
    try {
      const res = await api.get("/home");
      const list = res.data || [];
      setAvailableListings(list);
      if (list.length > 0 && !targetItem) {
        setTargetItem(list[0]);
        setSelectedTargetId(list[0]._id);
      }
    } catch (e) {}
  };

  const handleEstimate = async (e) => {
    e?.preventDefault();
    setEstimating(true);
    try {
      const res = await api.post("/swap/estimate", estimateData);
      setEstimatedResult(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setEstimating(false);
    }
  };

  const handleCompare = async () => {
    const tId = targetItem?._id || selectedTargetId;
    if (!selectedMyItemId || !tId) {
      return;
    }

    setComparing(true);
    try {
      const res = await api.post("/swap/value", {
        myClothId: selectedMyItemId,
        targetClothId: tId
      });
      setComparisonResult(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content calculator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calculator-header">
          <div className="calc-title-box">
            <span className="calc-badge-icon">⚖️</span>
            <div>
              <h3>Smart Swap Value Engine</h3>
              <p>Fair barter estimation & clothing compatibility score</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="calc-tabs">
          <button 
            className={`calc-tab-btn ${activeTab === "compare" ? "active" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            🔄 1:1 Swap Comparison
          </button>
          <button 
            className={`calc-tab-btn ${activeTab === "estimate" ? "active" : ""}`}
            onClick={() => setActiveTab("estimate")}
          >
            ✨ Clothing Value Estimator
          </button>
        </div>

        {activeTab === "compare" && (
          <div className="tab-pane">
            <p className="tab-hint">
              Select an item from your wardrobe and another listing to evaluate fairness before initiating a swap.
            </p>

            {myItems.length === 0 ? (
              <div className="empty-wardrobe-alert">
                <p>⚠️ You haven't uploaded any clothing items yet.</p>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => {
                    onClose();
                    window.location.href = "/upload";
                  }}
                >
                  Upload First Item
                </button>
              </div>
            ) : (
              <div className="comparison-selectors">
                <div className="selector-group">
                  <label>Your Garment:</label>
                  <select 
                    value={selectedMyItemId} 
                    onChange={(e) => setSelectedMyItemId(e.target.value)}
                  >
                    {myItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title} (Val: {item.swapValue} pts)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="swap-icon-divider">⇄</div>

                <div className="selector-group">
                  <label>Partner's Garment:</label>
                  {targetItem ? (
                    <div className="locked-target-badge">
                      <span>{targetItem.title}</span>
                      <small>({targetItem.swapValue} pts)</small>
                    </div>
                  ) : (
                    <select 
                      value={selectedTargetId} 
                      onChange={(e) => {
                        setSelectedTargetId(e.target.value);
                        const found = availableListings.find(l => l._id === e.target.value);
                        if (found) setTargetItem(found);
                      }}
                    >
                      {availableListings.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title} by {item.ownerName} ({item.swapValue} pts)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary btn-block compare-trigger-btn"
              onClick={handleCompare}
              disabled={comparing || myItems.length === 0}
            >
              {comparing ? "Analyzing Garment Values..." : "📊 Compare Barter Fairness"}
            </button>

            {comparisonResult && (
              <div className="comparison-result-card">
                <div className="result-headline">
                  <span className={`match-badge ${
                    comparisonResult.recommendation === "Excellent Match" 
                      ? "badge-success" 
                      : comparisonResult.recommendation === "Fair Match" 
                      ? "badge-warning" 
                      : "badge-danger"
                  }`}>
                    {comparisonResult.recommendation}
                  </span>
                  <h4>{comparisonResult.matchPercentage}% Compatibility</h4>
                </div>

                <div className="compatibility-meter">
                  <div 
                    className="meter-fill" 
                    style={{ width: `${comparisonResult.matchPercentage}%` }}
                  />
                </div>

                <div className="side-by-side-preview">
                  <div className="garment-slot my-garment">
                    <img src={comparisonResult.myItem.image} alt={comparisonResult.myItem.title} />
                    <span className="slot-title">{comparisonResult.myItem.title}</span>
                    <strong className="slot-val">{comparisonResult.myScore} pts</strong>
                  </div>

                  <div className="vs-badge">VS</div>

                  <div className="garment-slot target-garment">
                    <img src={comparisonResult.targetItem.image} alt={comparisonResult.targetItem.title} />
                    <span className="slot-title">{comparisonResult.targetItem.title}</span>
                    <strong className="slot-val">{comparisonResult.targetScore} pts</strong>
                  </div>
                </div>

                <div className="fairness-advice-box">
                  <p><b>Fairness Assessment:</b> {comparisonResult.advice}</p>
                  <p className="diff-note">Value disparity: <strong>{comparisonResult.difference} pts</strong></p>
                </div>

                {onSelectDeal && (
                  <button 
                    className="btn btn-accent btn-block"
                    onClick={() => {
                      onSelectDeal(selectedMyItemId);
                      onClose();
                    }}
                  >
                    🤝 Continue with this Offer
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "estimate" && (
          <form className="tab-pane" onSubmit={handleEstimate}>
            <p className="tab-hint">
              Input category, brand, and condition to compute fair barter points based on circular fashion depreciation standards.
            </p>

            <div className="estimator-grid">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={estimateData.category}
                  onChange={(e) => setEstimateData({ ...estimateData, category: e.target.value })}
                >
                  <option value="Jacket">Jacket / Outerwear</option>
                  <option value="Dress">Dress / Gown</option>
                  <option value="Jeans">Jeans / Denim</option>
                  <option value="Hoodie">Hoodie / Sweatshirt</option>
                  <option value="Shirt">Shirt / Button-Up</option>
                  <option value="T-Shirt">T-Shirt / Casual Top</option>
                  <option value="Kurti">Kurti / Ethnic Wear</option>
                  <option value="Trousers">Trousers / Chinos</option>
                </select>
              </div>

              <div className="form-group">
                <label>Brand / Manufacturer</label>
                <input 
                  type="text" 
                  placeholder="e.g. Levi's, Zara, Biba, Nike"
                  value={estimateData.brand}
                  onChange={(e) => setEstimateData({ ...estimateData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Condition</label>
                <select 
                  value={estimateData.condition}
                  onChange={(e) => setEstimateData({ ...estimateData, condition: e.target.value })}
                >
                  <option value="New">Brand New / With Tags</option>
                  <option value="Like New">Like New / Barely Worn</option>
                  <option value="Excellent">Excellent / Well Maintained</option>
                  <option value="Good">Good / Minor Wear</option>
                  <option value="Fair">Fair / Vintage Wear</option>
                </select>
              </div>

              <div className="form-group">
                <label>Original Retail Price (₹ / $ optional)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 2499"
                  value={estimateData.originalPrice}
                  onChange={(e) => setEstimateData({ ...estimateData, originalPrice: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={estimating}
            >
              {estimating ? "Calculating Valuation..." : "✨ Calculate Estimated Swap Value"}
            </button>

            {estimatedResult && (
              <div className="estimated-result-banner">
                <div className="est-left">
                  <span className="est-label">Estimated Swap Points</span>
                  <h2 className="est-val">{estimatedResult.estimatedValue} <span>pts</span></h2>
                </div>
                <div className="est-right">
                  <span className="badge badge-brand">Tier: {estimatedResult.tier}</span>
                  <p className="est-retention">Condition Retention: {estimatedResult.conditionFactor}</p>
                  <small>Recommended for listings and 1:1 barter trade</small>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default SwapCalculatorModal;

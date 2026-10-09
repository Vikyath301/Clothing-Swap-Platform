import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/uploadClothings.css";

function UploadClothing() {
  const navigate = useNavigate();

  const [cloth, setCloth] = useState({
    title: "",
    brand: "",
    category: "Shirt",
    size: "M",
    condition: "Excellent",
    swapValue: "150",
    location: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.location) {
          setCloth((prev) => ({ ...prev, location: u.location }));
        }
      } catch (e) {}
    }
  }, []);

  const handleAutoEstimate = async () => {
    if (!cloth.brand.trim()) {
      showToast("Please enter a brand name first", "info");
      return;
    }
    setCalculating(true);
    try {
      const res = await api.post("/swap/estimate", {
        category: cloth.category,
        brand: cloth.brand,
        condition: cloth.condition
      });
      if (res.data?.estimatedValue) {
        setCloth((prev) => ({ ...prev, swapValue: res.data.estimatedValue.toString() }));
        showToast(`Estimated fair value: ${res.data.estimatedValue} pts (${res.data.tier})`, "success");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCalculating(false);
    }
  };

  const uploadCloth = async (e) => {
    e.preventDefault();
    if (!cloth.title || !cloth.brand || !cloth.image || !cloth.location) {
      showToast("Please fill in all mandatory fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/upload", {
        ...cloth,
        swapValue: Number(cloth.swapValue) || 100
      });
      showToast(res.data.message || "Garment listed successfully!", "success");
      navigate("/my-Listings");
    } catch (err) {
      showToast(err.response?.data?.message || "Upload Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-wrapper">
      <div className="upload-form-card">
        <div className="upload-card-header">
          <h2>List Garment for Barter Swap</h2>
          <p>Give your pre-loved clothes a circular second life in our exchange community.</p>
        </div>

        <form onSubmit={uploadCloth} className="upload-grid-form">
          <div className="form-group full-width">
            <label>Garment Title *</label>
            <input
              type="text"
              placeholder="e.g. Classic Denim Trucker Jacket"
              value={cloth.title}
              onChange={(e) => setCloth({ ...cloth, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Brand / Designer *</label>
            <input
              type="text"
              placeholder="e.g. Levi's, Zara, Biba, Nike"
              value={cloth.brand}
              onChange={(e) => setCloth({ ...cloth, brand: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={cloth.category}
              onChange={(e) => setCloth({ ...cloth, category: e.target.value })}
            >
              <option value="Jacket">Jacket / Outerwear</option>
              <option value="Jeans">Jeans / Denim</option>
              <option value="Hoodie">Hoodie / Sweatshirt</option>
              <option value="Shirt">Shirt / Button-Up</option>
              <option value="T-Shirt">T-Shirt / Top</option>
              <option value="Dress">Dress / Gown</option>
              <option value="Kurti">Kurti / Ethnic Wear</option>
              <option value="Trousers">Trousers / Chinos</option>
              <option value="Shoes">Footwear / Shoes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Size *</label>
            <select
              value={cloth.size}
              onChange={(e) => setCloth({ ...cloth, size: e.target.value })}
            >
              <option value="XS">XS (Extra Small)</option>
              <option value="S">S (Small)</option>
              <option value="M">M (Medium)</option>
              <option value="L">L (Large)</option>
              <option value="XL">XL (Extra Large)</option>
              <option value="XXL">XXL</option>
              <option value="Free Size">Free Size / Universal</option>
              <option value="28">28</option>
              <option value="30">30</option>
              <option value="32">32</option>
              <option value="34">34</option>
              <option value="36">36</option>
            </select>
          </div>

          <div className="form-group">
            <label>Condition *</label>
            <select
              value={cloth.condition}
              onChange={(e) => setCloth({ ...cloth, condition: e.target.value })}
            >
              <option value="Brand New">Brand New / With Tags</option>
              <option value="Like New">Like New / Barely Worn</option>
              <option value="Excellent">Excellent / Well Maintained</option>
              <option value="Good">Good / Minor Wear</option>
              <option value="Fair">Fair / Vintage Character</option>
            </select>
          </div>

          <div className="form-group full-width">
            <div className="swap-val-label-row">
              <label>Swap Value (Points) *</label>
              <button
                type="button"
                className="btn-auto-val"
                onClick={handleAutoEstimate}
                disabled={calculating}
              >
                {calculating ? "Calculating..." : "✨ Auto-Estimate Fair Value"}
              </button>
            </div>
            <input
              type="number"
              placeholder="e.g. 180"
              value={cloth.swapValue}
              onChange={(e) => setCloth({ ...cloth, swapValue: e.target.value })}
              required
            />
            <small className="help-text">
              Points represent equitable circular barter units based on condition and brand tier.
            </small>
          </div>

          <div className="form-group full-width">
            <label>Pickup Location / City *</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, Indiranagar"
              value={cloth.location}
              onChange={(e) => setCloth({ ...cloth, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Image URL *</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or direct image link"
              value={cloth.image}
              onChange={(e) => setCloth({ ...cloth, image: e.target.value })}
              required
            />
          </div>

          {cloth.image && (
            <div className="form-group full-width image-preview-wrapper">
              <label>Live Image Preview:</label>
              <div className="preview-frame">
                <img
                  src={cloth.image}
                  alt="Garment Preview"
                  onError={(e) => (e.target.style.display = "none")}
                  onLoad={(e) => (e.target.style.display = "block")}
                />
              </div>
            </div>
          )}

          <div className="form-group full-width submit-row">
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? "Publishing Listing..." : "🌱 Publish Clothing Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadClothing;
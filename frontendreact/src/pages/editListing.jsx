import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/uploadClothings.css";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cloth, setCloth] = useState({
    title: "",
    category: "Shirt",
    size: "M",
    condition: "Excellent",
    swapValue: "",
    description: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCloth();
  }, [id]);

  async function fetchCloth() {
    try {
      const res = await api.get(`/my-Listings/edit/${id}`);
      setCloth(res.data);
    } catch (err) {
      console.log(err);
      showToast("Unable to load listing details", "error");
    }
  }

  async function updateListing(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/my-Listings/edit/${id}`, {
        ...cloth,
        swapValue: Number(cloth.swapValue)
      });
      showToast("Listing updated successfully!", "success");
      navigate("/my-Listings");
    } catch (err) {
      console.log(err);
      showToast("Failed to update listing", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page-wrapper">
      <div className="upload-form-card">
        <div className="upload-card-header">
          <h2>Edit Garment Listing</h2>
          <p>Update sizing, condition, swap points, or imagery.</p>
        </div>

        <form onSubmit={updateListing} className="upload-grid-form">
          <div className="form-group full-width">
            <label>Garment Title *</label>
            <input
              type="text"
              value={cloth.title || ""}
              placeholder="Title"
              onChange={(e) => setCloth({ ...cloth, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={cloth.category || "Shirt"}
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
            <input
              type="text"
              value={cloth.size || ""}
              placeholder="e.g. M, L, 32"
              onChange={(e) => setCloth({ ...cloth, size: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Condition *</label>
            <select
              value={cloth.condition || "Excellent"}
              onChange={(e) => setCloth({ ...cloth, condition: e.target.value })}
            >
              <option value="Brand New">Brand New / With Tags</option>
              <option value="Like New">Like New / Barely Worn</option>
              <option value="Excellent">Excellent / Well Maintained</option>
              <option value="Good">Good / Minor Wear</option>
              <option value="Fair">Fair / Vintage Character</option>
            </select>
          </div>

          <div className="form-group">
            <label>Swap Value (Points) *</label>
            <input
              type="number"
              value={cloth.swapValue || ""}
              placeholder="Swap Value"
              onChange={(e) => setCloth({ ...cloth, swapValue: e.target.value })}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description & Condition Details</label>
            <textarea
              rows="3"
              value={cloth.description || ""}
              placeholder="Describe styling, fabric care, or measurements..."
              onChange={(e) => setCloth({ ...cloth, description: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label>Image URL *</label>
            <input
              type="url"
              value={cloth.image || ""}
              placeholder="Image URL"
              onChange={(e) => setCloth({ ...cloth, image: e.target.value })}
              required
            />
          </div>

          {cloth.image && (
            <div className="form-group full-width image-preview-wrapper">
              <label>Current Preview:</label>
              <div className="preview-frame">
                <img src={cloth.image} alt="Preview" />
              </div>
            </div>
          )}

          <div className="form-group full-width submit-row">
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? "Updating..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;
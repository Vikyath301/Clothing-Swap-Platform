import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/myListings.css";

function MyListings() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const res = await api.get("/my-Listings");
      setClothes(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to load listings", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteListing(id) {
    if (!window.confirm("Are you sure you want to delete this listing from your wardrobe?")) {
      return;
    }
    try {
      await api.delete(`/my-Listings/${id}`);
      showToast("Listing removed successfully", "success");
      fetchListings();
    } catch (err) {
      console.log(err);
      showToast("Failed to delete listing", "error");
    }
  }

  return (
    <div className="my-listings-container">
      <div className="listings-page-header">
        <div>
          <h1>My Wardrobe Listings</h1>
          <p>Manage the clothing items you've offered for sustainable barter exchange.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          ➕ List New Garment
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your wardrobe...</p>
        </div>
      ) : clothes.length === 0 ? (
        <div className="empty-wardrobe-card">
          <span className="empty-icon">🧥</span>
          <h3>Your wardrobe is currently empty</h3>
          <p>List your pre-loved clothes to start participating in the barter economy.</p>
          <Link to="/upload" className="btn btn-primary">
            Upload Your First Item
          </Link>
        </div>
      ) : (
        <div className="wardrobe-grid">
          {clothes.map((cloth) => (
            <div className="wardrobe-card" key={cloth._id}>
              <div className="wardrobe-img-box">
                <img src={cloth.image} alt={cloth.title} />
                <span className={`status-pill ${cloth.isAvailable ? "status-avail" : "status-used"}`}>
                  {cloth.isAvailable ? "Available" : "Swapped"}
                </span>
                <span className="wardrobe-pts">⚖️ {cloth.swapValue} pts</span>
              </div>

              <div className="wardrobe-body">
                <h3>{cloth.title}</h3>
                <p className="wardrobe-brand">Brand: {cloth.brand}</p>
                <div className="wardrobe-chips">
                  <span>{cloth.category}</span>
                  <span>Size: {cloth.size}</span>
                  <span>{cloth.condition}</span>
                </div>
                <p className="wardrobe-location">📍 {cloth.location}</p>

                <div className="wardrobe-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate(`/item/${cloth._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/edit/${cloth._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteListing(cloth._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
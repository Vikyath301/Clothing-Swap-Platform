import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/manageListing.css";

function AdminListings() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/listings");
      setListings(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("Unable to load listings", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove listing "${title}"?`)) return;

    try {
      await api.delete(`/admin/listing/${id}`);
      showToast("Listing removed from platform", "success");
      fetchListings();
    } catch (err) {
      showToast("Failed to remove listing", "error");
    }
  };

  const filteredListings = listings.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.brand?.toLowerCase().includes(q) ||
      item.ownerName?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-subpage-container">
      <div className="subpage-header-row">
        <div>
          <Link to="/admin" className="subpage-back-link">← Back to Admin Portal</Link>
          <h2>Manage Wardrobe Listings</h2>
          <p>Inspect published garments, review metadata, and remove inappropriate items.</p>
        </div>
        <span className="badge badge-brand">{listings.length} Active Listings</span>
      </div>

      <div className="table-controls card-base">
        <input
          type="text"
          placeholder="Filter by title, brand, owner, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="table-loading">
          <p>Loading catalog items...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="table-empty card-base">
          <p>No listings found matching filter criteria.</p>
        </div>
      ) : (
        <div className="admin-listing-grid">
          {filteredListings.map((cloth) => (
            <div className="admin-cloth-card card-base" key={cloth._id}>
              <div className="admin-img-wrap">
                <img src={cloth.image} alt={cloth.title} />
                <span className={`status-pill ${cloth.isAvailable ? "status-avail" : "status-used"}`}>
                  {cloth.isAvailable ? "Available" : "Swapped"}
                </span>
              </div>

              <div className="admin-cloth-info">
                <h3>{cloth.title}</h3>
                <p className="cloth-brand">Brand: <strong>{cloth.brand}</strong></p>
                <div className="cloth-meta-pills">
                  <span>{cloth.category}</span>
                  <span>Size: {cloth.size}</span>
                  <span>{cloth.condition}</span>
                  <span>⚖️ {cloth.swapValue} pts</span>
                </div>
                <p className="cloth-owner">👤 Listed by: {cloth.ownerName}</p>
                <p className="cloth-loc">📍 Location: {cloth.location}</p>

                <button
                  className="btn btn-sm btn-danger btn-block remove-cloth-btn"
                  onClick={() => deleteListing(cloth._id, cloth.title)}
                >
                  🗑️ Remove Inappropriate Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminListings;
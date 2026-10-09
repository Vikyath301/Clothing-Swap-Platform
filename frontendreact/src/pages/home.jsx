import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import SwapCalculatorModal from "../components/SwapCalculatorModal";
import "../css/home.css";

const CATEGORIES = ["All", "Jacket", "Jeans", "Hoodie", "Dress", "T-Shirt", "Kurti", "Shirt", "Trousers", "Men", "Women"];

function Home() {
  const navigate = useNavigate();
  const [clothes, setClothes] = useState([]);
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("");
  const [calculatorItem, setCalculatorItem] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.location) {
          setUserLocation(u.location);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    fetchClothes(category, location, search);
  }, [location, category]);

  const fetchClothes = async (cat = category, loc = location, s = search) => {
    setLoading(true);
    try {
      let query = `?location=${encodeURIComponent(loc)}&category=${encodeURIComponent(cat)}`;
      if (s && s.trim()) {
        query += `&search=${encodeURIComponent(s.trim())}`;
      }
      const res = await api.get(`/home${query}`);
      setClothes(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearch("");
    fetchClothes(cat, location, "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClothes(category, location, search);
  };

  const handleResetFilters = () => {
    setLocation("All");
    setCategory("All");
    setSearch("");
    fetchClothes("All", "All", "");
  };

  const setLocationFilter = (loc) => {
    setLocation(loc);
  };

  return (
    <div className="home-page-container">
      {/* Hero Banner with Sustainable Barter Context */}
      <div className="home-hero-card">
        <div className="hero-content">
          <span className="hero-tag">🌱 Circular Fashion Movement</span>
          <h1>Trade Clothes Directly. Prevent Textile Waste.</h1>
          <p>
            Fast fashion produces tons of landfill waste each year. Exchange your wearable garments with nearby peers through a pure barter economy — zero cash, genuine sustainable style.
          </p>
          <div className="hero-action-row">
            <Link to="/upload" className="btn btn-primary">
              ➕ List Your Garment
            </Link>
            <button 
              className="btn btn-secondary" 
              onClick={() => setCalculatorItem({})}
            >
              ⚖️ Smart Swap Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Location-Based Matching Banner */}
      {userLocation && (
        <div className="nearby-opportunity-banner">
          <div className="nearby-text">
            <span className="nearby-icon">📍</span>
            <div>
              <strong>Location-Based Matching: {userLocation}</strong>
              <p>Discover available clothing items offered by peers in your neighborhood for easy handoff.</p>
            </div>
          </div>
          <button 
            className={`btn btn-sm ${location.toLowerCase() === userLocation.toLowerCase() ? "btn-primary" : "btn-outline"}`}
            onClick={() => setLocationFilter(location === userLocation ? "All" : userLocation)}
          >
            {location.toLowerCase() === userLocation.toLowerCase() ? "✓ Showing Nearby" : `Filter by ${userLocation}`}
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="filter-panel">
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by cloth title, brand, or style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div className="location-select-wrapper">
          <label htmlFor="location-select">Location:</label>
          <select
            id="location-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mangalore">Mangalore</option>
            <option value="Udupi">Udupi</option>
            <option value="Manipal">Manipal</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-scroll-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${category === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clothing Listings Grid */}
      <div className="listings-section-header">
        <h2>Available Clothes for Swap</h2>
        <span className="items-count-badge">{clothes.length} items found</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading wardrobe listings...</p>
        </div>
      ) : clothes.length === 0 ? (
        <div className="empty-listings-state">
          <span className="empty-state-icon">👕</span>
          <h3>No matching clothes found</h3>
          <p>Try clearing filters or be the first to upload a garment in this category!</p>
          <div className="empty-actions">
            <button
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
            <Link to="/upload" className="btn btn-primary">
              Upload Clothing
            </Link>
          </div>
        </div>
      ) : (
        <div className="clothing-grid">
          {clothes.map((cloth) => (
            <div className="clothing-card" key={cloth._id}>
              <div className="card-image-wrapper">
                <img src={cloth.image} alt={cloth.title} loading="lazy" />
                <span className={`status-tag ${cloth.isAvailable ? "status-available" : "status-swapped"}`}>
                  {cloth.isAvailable ? "Available" : "Swapped"}
                </span>
                <span className="value-tag">⚖️ {cloth.swapValue} pts</span>
              </div>

              <div className="card-details">
                <div className="card-title-row">
                  <h3 className="card-title" title={cloth.title}>{cloth.title}</h3>
                </div>

                <p className="card-brand">Brand: <strong>{cloth.brand}</strong></p>

                <div className="card-spec-chips">
                  <span className="spec-chip">Category: {cloth.category}</span>
                  <span className="spec-chip">Size: {cloth.size}</span>
                  <span className="spec-chip">Condition: {cloth.condition}</span>
                </div>

                <div className="card-owner-row">
                  <span className="owner-badge">👤 {cloth.ownerName}</span>
                  <span className="location-badge">📍 {cloth.location}</span>
                </div>

                <div className="card-footer-actions">
                  <Link to={`/item/${cloth._id}`} className="btn btn-primary btn-block">
                    View Details & Swap
                  </Link>
                  <button 
                    className="btn btn-outline btn-sm btn-block"
                    onClick={() => setCalculatorItem(cloth)}
                  >
                    ⚖️ Compare Value
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {calculatorItem && (
        <SwapCalculatorModal
          initialTargetItem={calculatorItem._id ? calculatorItem : null}
          onClose={() => setCalculatorItem(null)}
        />
      )}
    </div>
  );
}

export default Home;
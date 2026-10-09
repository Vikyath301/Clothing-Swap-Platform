import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="rewear-footer">
      <div className="footer-impact-bar">
        <div className="impact-stat">
          <span className="stat-icon">🌱</span>
          <div>
            <strong>100% Barter Economy</strong>
            <p>Direct peer-to-peer wardrobe exchange</p>
          </div>
        </div>
        <div className="impact-stat">
          <span className="stat-icon">💧</span>
          <div>
            <strong>2,500L Water Preserved</strong>
            <p>Every single garment swapped saves precious resources</p>
          </div>
        </div>
        <div className="impact-stat">
          <span className="stat-icon">♻️</span>
          <div>
            <strong>Zero Textile Waste</strong>
            <p>Keep wearable clothes in active circular rotation</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="logo-symbol">🌿</span>
            <span className="logo-title">ReWear</span>
          </div>
          <p className="footer-desc">
            Empowering mindful consumers to trade high-quality clothing directly with nearby fashion lovers. Cut down consumption, cherish authentic style, and protect our environment.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <Link to="/home">Browse Available Clothes</Link>
          <Link to="/upload">List a Garment</Link>
          <Link to="/myDeals">Pending Swap Offers</Link>
          <Link to="/my-Listings">Manage Wardrobe</Link>
        </div>

        <div className="footer-links-col">
          <h4>Features</h4>
          <Link to="/home">Location-Based Matches</Link>
          <Link to="/myDeals">Real-Time Negotiation</Link>
          <Link to="/profile">Sustainability Impact</Link>
          <Link to="/admin">Admin Resolution Portal</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ReWear Circular Fashion Marketplace. Crafted for sustainable style.</p>
      </div>
    </footer>
  );
}

export default Footer;

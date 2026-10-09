import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        location
      });

      showToast(res.data.message || "Registration Successful! Please sign in.", "success");
      setName("");
      setEmail("");
      setPassword("");
      setLocation("");

      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">🌿</span>
          <h2>Join the Swap Movement</h2>
          <p>Create your ReWear account and start circular wardrobe trading</p>
        </div>

        <form onSubmit={registerUser} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>City / Location (for nearby swaps) *</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, Mangalore, Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account & Start Swapping"}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
import { useNavigate } from "react-router-dom";
import "../css/admin.css";

function Admin() {

    const navigate = useNavigate();

    return (

        <div className="admin-page">

            <h1>Admin Dashboard</h1>

            <div className="admin-cards">

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/users")}>
                    👤
                    <h2>Manage Users</h2>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/listings")}>
                    👕
                    <h2>Manage Listings</h2>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/swaps")}>
                    🔄
                    <h2>Swap Activities</h2>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/analytics")}>
                    📊
                    <h2>Analytics</h2>
                </div>

                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/disputes")}>
                    ⚠
                    <h2>Disputes</h2>
                </div>
            </div>
        </div>
    );
}

export default Admin;
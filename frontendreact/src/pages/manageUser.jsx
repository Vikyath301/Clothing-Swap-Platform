import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { showToast } from "../components/Toast";
import "../css/manageUser.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      showToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id, userName) {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete user "${userName}" and all their listings?`
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/admin/user/${id}`);
      showToast(res.data.message || "User account removed", "success");
      fetchUsers();
    } catch (err) {
      console.log(err);
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    }
  }

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-subpage-container">
      <div className="subpage-header-row">
        <div>
          <Link to="/admin" className="subpage-back-link">← Back to Admin Portal</Link>
          <h2>Manage Swapper Accounts</h2>
          <p>Review registered users, monitor profiles, and remove bad actors.</p>
        </div>
        <span className="badge badge-brand">{users.length} Registered Users</span>
      </div>

      <div className="table-controls card-base">
        <input
          type="text"
          placeholder="Filter users by name, email, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-card card-base">
        {loading ? (
          <div className="table-loading">
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="table-empty">
            <p>No matching users found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-table-cell">
                        <div className="table-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "—"}</td>
                    <td>📍 {user.location || "Unspecified"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteUser(user._id, user.name)}
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
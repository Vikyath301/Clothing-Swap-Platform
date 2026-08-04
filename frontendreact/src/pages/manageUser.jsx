import { useEffect, useState } from "react";
import axios from "axios";
import "../css/manageUser.css";

const API = import.meta.env.VITE_API_URL;


function ManageUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {

            const res = await axios.get(
                `${API}/admin/users`,
                {
                    withCredentials: true
                }
            );
            setUsers(res.data);
        }

        catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }

    async function deleteUser(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;
        try {

            const res = await axios.delete(
                `${API}/admin/user/${id}`,
                {
                    withCredentials: true
                }
            );
            alert(res.data.message);
            fetchUsers();
        }
        catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }

    return (

        <div className="manage-users">
            <h1>Manage Users</h1>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.location}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteUser(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;
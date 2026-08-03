import { useEffect, useState } from "react";
import axios from "axios";
import "../css/manageDispute.css";

function AdminDisputes() {

    const [disputes, setDisputes] = useState([]);

    useEffect(() => {
        fetchDisputes();
    }, []);

    async function fetchDisputes() {
        try {
            const res = await axios.get(
                "http://localhost:5000/admin/disputes",
                {
                    withCredentials: true
                }
            );

            setDisputes(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function updateStatus(id, status) {
        try {

            await axios.patch(
                `http://localhost:5000/admin/disputes/${id}`,
                {
                    status
                },
                {
                    withCredentials: true
                }
            );
            fetchDisputes();

        } catch (err) {
            console.log(err);
            alert("Unable to update dispute.");
        }
    }

    return (

        <div>
            <h1>All Disputes</h1>
            {
                disputes.map((dispute) => (

                    <div className="disputeCard" key={dispute._id}>

                        <h3>{dispute.raisedByName}</h3>

                        <p>
                            <strong>Owner:</strong> {dispute.ownerName}
                        </p>

                        <p>
                            <strong>Reason:</strong> {dispute.reason}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(dispute.createdAt).toLocaleDateString()}
                        </p>

                        <span className={`status ${dispute.status}`}>
                            {dispute.status}
                        </span>

                        {
                            dispute.status === "Pending" && (
                                <div className="btnContainer">

                                    <button
                                        className="resolveBtn"
                                        onClick={() =>
                                            updateStatus(dispute._id, "Resolved")
                                        }
                                    >
                                        Resolve
                                    </button>

                                    <button
                                        className="rejectBtn"
                                        onClick={() =>
                                            updateStatus(dispute._id, "Rejected")
                                        }>
                                        Reject </button>
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default AdminDisputes;
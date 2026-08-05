import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Analytics.css";

const API = import.meta.env.VITE_API_URL;

function Analytics() {

    const [data, setData] = useState({});

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {

        try {
            const res = await axios.get(
                `${API}/admin/analytics`,
                {
                    withCredentials: true
                }
            );
            setData(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    return (

        <div className="analytics-page">
            <h1>Platform Analytics</h1>

            <div className="cards">
                <div className="card">
                    <h2>{data.totalUsers}</h2>
                    <p>Total Users</p>
                </div>

                <div className="card">
                    <h2>{data.totalListings}</h2>
                    <p>Total Listings</p>
                </div>

                <div className="card">
                    <h2>{data.availableListings}</h2>
                    <p>Available Listings</p>
                </div>

                <div className="card">
                    <h2>{data.pendingDeals}</h2>
                    <p>Pending Deals</p>
                </div>

                <div className="card">
                    <h2>{data.completedSwaps}</h2>
                    <p>Completed Swaps</p>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
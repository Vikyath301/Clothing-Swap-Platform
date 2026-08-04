import { useEffect, useState } from "react";
import axios from "axios";
import "../css/swapActivities.css";

function SwapActivities() {

    const [swaps, setSwaps] = useState([]);

    useEffect(() => {
        fetchSwaps();
    }, []);

    const fetchSwaps = async () => {
        try {

            const res = await axios.get(
                `${API}/admin/swaps`,
                {
                    withCredentials: true
                }
            );
            setSwaps(res.data);
        }

        catch (err) {
            console.log(err);
        }
    };

    return (

        <div className="swap-page">
            <h1>Monitor Swap Activities</h1>
            <table>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>

                </thead>
                <tbody>
                    {
                        swaps.map((swap) => (
                            <tr key={swap._id}>
                                <td>{swap.ownerName}</td>
                                <td>{swap.customerName}</td>
                                <td>{swap.status}</td>
                                <td>
                                    {
                                        new Date(
                                            swap.createdAt
                                        ).toLocaleDateString()
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default SwapActivities;
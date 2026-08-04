import {useEffect,useState} from "react";

import axios from "axios";

function MyDeals(){
    const [deals,setDeals]=useState([]);

    const [showDispute, setShowDispute] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(()=>{
        fetchDeals();
    },[]);                      
    async function fetchDeals(){
        const res = await axios.get(
            `${API}/mydeals`,
            {
                withCredentials:true
            }
        );
        setDeals(res.data);
    }

    async function raiseDispute() {
        try {

            await axios.post(
                `${API}/dispute/create`,
                {
                    dealId: showDispute._id,
                    clothId: showDispute.clothId,
                    ownerId: showDispute.ownerId,
                    ownerName: showDispute.ownerName,
                    reason
                },
                {
                    withCredentials: true
                }
            );
            alert("Dispute Raised");
            setShowDispute(null);
            setReason("");

        } catch (err) {
            console.log(err);
            alert("Unable to raise dispute");
        }
    }


    return(

        <div>
            <h1>My Deals</h1>
            {
                deals.map((deal)=>(
                    <div key={deal._id}>
                        <h3 style={{ color : "black"}}>{deal.customerName}</h3>
                        <p  style={{ color :"black"}}>{deal.status}</p>

                        <button onClick={() => setShowDispute(deal)}> Raise Dispute </button>
                    </div>
                ))
            }

            {
              showDispute && (
                    <div className="disputeBox">

                        <h3>Raise Dispute</h3>

                        <textarea
                            placeholder="Enter dispute reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <button onClick={raiseDispute}>
                            Submit
                        </button>

                        <button
                            onClick={() => {
                                setShowDispute(null);
                                setReason("");
                            }}>
                            Cancel
                        </button>

                    </div>
                )
            }
    </div>
);

}

export default MyDeals;
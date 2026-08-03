import {useEffect,useState} from "react";

import axios from "axios";

function PendingDeals(){

    const [deals,setDeals] = useState([]);

    useEffect(()=>{
        fetchDeals();
    },[]);

    async function fetchDeals(){

        try{
            const res = await axios.get(
                "http://localhost:5000/deal/pending",
                {
                    withCredentials:true
                }
            );
            setDeals(res.data);
        }
        catch(err){
            console.log(err);
        }
    }

    async function acceptDeal(id){

        await axios.put(
            `http://localhost:5000/deal/accept/${id}`,
            {},
            {
                withCredentials:true
            }
        );
        fetchDeals();
    }

    async function rejectDeal(id){

        await axios.put(
            `http://localhost:5000/deal/reject/${id}`,
            {},

            {
                withCredentials:true
            }
        );
        fetchDeals();
    }

    return(

        <div>
            <h1>Pending Deals</h1>
            {
                deals.map((deal)=>(
                    <div key={deal._id}>
                        <h3>{deal.customerName}</h3>
                        <p style={{ color : "black"}}>Status : {deal.status}</p>
                        <button
                         onClick={()=>acceptDeal(deal._id)}
                        >
                            Accept
                        </button>
                        <button
                            onClick={()=>rejectDeal(deal._id)}
                        >
                            Reject
                        </button>
                    </div>
                ))
            }
        </div>
    );
}

export default PendingDeals;
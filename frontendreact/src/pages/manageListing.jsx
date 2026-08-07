import { useEffect, useState } from "react";
import axios from "axios";
import "../css/manageListing.css";

const API = import.meta.env.VITE_API_URL;


function AdminListings() {

    const [listings, setListings] = useState([]);

    const fetchListings = async () => {
        try{
            const res = await axios.get(
                `${API}/admin/listings`
            );
            setListings(res.data);
        }
        catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const deleteListing = async(id)=>{
        if(!window.confirm("Delete this listing?"))
            return;

        await axios.delete(
            `${API}/admin/listing/${id}`
        );
        fetchListings();
    };

    return (

        <div className="admin-page">
            <h1>Manage Listings</h1>
            <div className="listing-container">

                {listings.map((cloth)=>(

                    <div className="listing-card" key={cloth._id}>
                        <img src={cloth.image} alt=""/>

                        <h3 style={{ color : "black"}}>{cloth.title}</h3>
                        <p  style={{ color : "black"}}>
                            {cloth.brand}
                        </p>
                        <p style={{ color : "black"}}>
                            {cloth.location}
                        </p>
                        <p style={{ color : "black"}}>
                            Owner : {cloth.ownerName}
                        </p>

                        <button
                        onClick={()=>
                        deleteListing(cloth._id)
                        }>Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminListings;
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/manageListing.css";

function AdminListings() {

    const [listings, setListings] = useState([]);

    const fetchListings = async () => {
        try{
            const res = await axios.get(
                "http://localhost:5000/admin/listings"
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
            `http://localhost:5000/admin/listing/${id}`
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

                        <h3>{cloth.title}</h3>
                        <p>
                            {cloth.brand}
                        </p>
                        <p>
                            {cloth.location}
                        </p>
                        <p>
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
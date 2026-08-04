import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/myListings.css";

const API = import.meta.env.VITE_API_URL;


function MyListings() {
    const [clothes, setClothes] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    async function fetchListings() {

        try {
            const res = await axios.get(
                `${API}/my-Listings`,
                {
                    withCredentials: true
                }
            );
            setClothes(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }


    async function deleteListing(id) {
        try {
            await axios.delete(
                `${API}/my-Listings/${id}`,
                {
                    withCredentials: true
                }
            );
            fetchListings();    
        }
        catch (err) {

            console.log(err);
        }
    }

    return (

        <div className="myListings">
            <h1>My Listings</h1>
            <div className="my-card-container">
                {
                    clothes.map((cloth) => (
                        <div
                            className="my-card"
                            key={cloth._id}>
                            <img
                                src={cloth.image}
                                alt={cloth.title}
                            />
                            <h2>{cloth.title}</h2>
                            <p>Brand : {cloth.brand}</p>
                            <p>Category : {cloth.category}</p>
                            <p>Size : {cloth.size}</p>
                            <p>Condition : {cloth.condition}</p>
                            <p>
                                Status :
                                {cloth.isAvailable
                                    ? " 🟢 Available"
                                    : " 🔴 Swapped"}
                            </p>
                            <button onClick={() => navigate(`/edit/${cloth._id}`)}> Edit </button>
                            <button onClick={() => deleteListing(cloth._id)}> Delete </button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default MyListings;
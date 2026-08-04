import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditListing() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [cloth, setCloth] = useState({

        title: "",
        category: "",
        size: "",
        condition: "",
        swapValue: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        fetchCloth();
    }, []);

    async function fetchCloth() {
        const res = await axios.get(
            `${API}/my-Listings/edit/${id}`,
            {
                withCredentials: true
            }
        );
        setCloth(res.data);
    }

    async function updateListing(e) {
        e.preventDefault();
        await axios.put(
            `${API}/my-Listings/edit/${id}`,
            cloth,
            {
                withCredentials: true
            }
        );
        alert("Listing Updated");
        navigate("/my-Listings");
    }

    return (

        <div className="edit-page">
            <h2>Edit Listing</h2>

            <form onSubmit={updateListing}>
                <label>Change the Cloth name </label>
                <input
                    type="text"
                    value={cloth.title}
                    placeholder="Title"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            title: e.target.value
                        })
                    }
                />

                <label>Change the cloth Category </label>
                <input
                    type="text"
                    value={cloth.category}
                    placeholder="Category"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            category: e.target.value
                        })
                    }
                />

                <label>Change the cloth Size</label>
                <input
                    type="text"
                    value={cloth.size}
                    placeholder="Size"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            size: e.target.value
                        })
                    }
                />

                <label>Change Cloths Condition</label>
                <input
                    type="text"
                    value={cloth.condition}
                    placeholder="Condition"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            condition: e.target.value
                        })
                    }
                />

                <label>Change Swap Value </label>
                <input
                    type="number"
                    value={cloth.swapValue}
                    placeholder="Swap Value"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            swapValue: e.target.value
                        })
                    }
                />

                <label>Change Description</label><br></br>
                <textarea
                    value={cloth.description}
                    placeholder="Description"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            description: e.target.value
                        })
                    }
                /><br /><br />

                <label>Change the Image </label>
                <input
                    type="text"
                    value={cloth.image}
                    placeholder="Image URL"
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            image: e.target.value
                        })
                    }
                />
                <button type="submit">
                    Update Listing
                </button>
            </form>
        </div>
    );
}

export default EditListing;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/uploadClothings.css";

const API = import.meta.env.VITE_API_URL;



function UploadClothing() {

    const navigate = useNavigate();

    const [cloth, setCloth] = useState({

        title: "",
        brand: "",
        category: "",
        size: "",
        condition: "",
        swapValue: "",
        location: "",
        image: ""
    });

    async function uploadCloth(e) {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${API}/upload`,
                cloth,
                {
                    withCredentials: true
                }
            );
            alert(res.data.message);
            navigate("/my-Listings");
        }

        catch (err) {
            alert(err.response?.data?.message || "Upload Failed");
        }
    }

    return (

        <div className="upload-container">
            <h2>Upload Clothing</h2>
            <form onSubmit={uploadCloth}>
                <label>Enter a Title of the Cloth </label>
                <input
                    type="text"
                    placeholder="Title"
                    value={cloth.title}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            title: e.target.value
                        })
                    }
                />

                <label>Enter the Brand of the Cloth</label>
                <input
                    type="text"
                    placeholder="Brand"
                    value={cloth.brand}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            brand: e.target.value
                        })
                    }
                />

                <label>Enter the Category of Cloth</label>
                <input
                    type="text"
                    placeholder="Category"
                    value={cloth.category}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            category: e.target.value
                        })
                    }
                />

                <label>Enter the size of the Cloth</label>
                <input
                    type="text"
                    placeholder="Size"
                    value={cloth.size}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            size: e.target.value
                        })
                    }
                />

                <label>Enter the condition of the cloth </label>
                <input
                    type="text"
                    placeholder="Condition"
                    value={cloth.condition}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            condition: e.target.value
                        })
                    }
                />

                <label>Enter the swap Value</label>
                <input
                    type="number"
                    placeholder="Swap Value"
                    value={cloth.swapValue}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            swapValue: e.target.value
                        })
                    }
                />

                <label>Enter the Location</label>
                <input
                    type="text"
                    placeholder="Location"
                    value={cloth.location}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            location: e.target.value
                        })
                    }
                />

                <label>Enter the Image URL</label>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={cloth.image}
                    onChange={(e) =>
                        setCloth({
                            ...cloth,
                            image: e.target.value
                        })
                    }
                />

                {
                    cloth.image && (
                        <img
                            src={cloth.image}
                            alt="Preview"
                            className="preview-image"
                        />
                    )
                }

                <button type="submit">
                    Upload Clothing
                </button>
            </form>
        </div>
    );
}

export default UploadClothing;
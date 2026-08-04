import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/itemDetails.css";


function ItemDetails(){

    const navigate=useNavigate();
    const { id } = useParams();
    const [cloth, setCloth] = useState(null);

    const [showCalculator,setShowCalculator]=useState(false);
    const [myItems,setMyItems]=useState([]);
    const [selectedItem,setSelectedItem]=useState("");
    const [result,setResult]=useState(null);

    useEffect(() => {
        fetchCloth();
    }, []);

    const fetchCloth = async () => {

        try{
            const res = await axios.get(`${API}/item/${id}`);
            setCloth(res.data);
        }
        catch(err){
            console.log(err);
        }
    };

    if(!cloth){
        return <h2>Loading...</h2>;
    }



    const openSwapCalculator = async () => {
        try{
            const res = await axios.get(
                `${API}/my-Listings`,
                {
                    withCredentials:true
                }
            );
            setMyItems(res.data);
            setShowCalculator(true);
        }
    
        catch(err){
            console.log(err);
        }
    }


    const calculateSwap = async () => {
        if (!selectedItem) {
            alert("Select your item first");
            return;
        }
    
        const res = await axios.post(
            `${API}/swap/value`,
            {
                myClothId: selectedItem,
                targetClothId: cloth._id
            },
            {
                withCredentials: true
            }
        );
        setResult(res.data);
    };

    return(

        <div className="details-container">
            <img src={cloth.image} alt={cloth.title} />

            <div className="details">
                <h1>{cloth.title}</h1>
                <p><b>Owner :</b> {cloth.ownerName}</p>
                <p><b>Brand :</b> {cloth.brand}</p>
                <p><b>Category :</b> {cloth.category}</p>
                <p><b>Size :</b> {cloth.size}</p>
                <p><b>Condition :</b> {cloth.condition}</p>
                <p><b>Swap Value :</b> {cloth.swapValue}</p>
                <p><b>Location :</b> {cloth.location}</p>
                <p>
                    Status:
                    {cloth.isAvailable ? " 🟢 Available" : " 🔴 Swapped"}
                </p>
                {
                    cloth.isAvailable ? (
                        <button onClick={openSwapCalculator}>  Request Swap </button>
                    ) : (
                        <button disabled>
                            Already Swapped
                        </button>
                    )
                }
                {
                    showCalculator && (

                    <div className="calculator-popup">

                    <h2>Swap Calculator</h2>

                    <select
                    value={selectedItem}
                    onChange={(e)=>setSelectedItem(e.target.value)}
                    >

                    <option value="">Select Your Cloth</option>

                    {
                    myItems.map(item=>(
                    <option
                    key={item._id}
                    value={item._id}
                    >
                    {item.title}
                    </option>
                    ))
                    }

                    </select>

                    <br /><br />

                    <button onClick={calculateSwap}> Calculate  </button>

                    {
                    result && (
                    <div>
                    <hr />
                    <p>Your Swap Value : {result.myScore}</p>
                    <p>Other Swap Value : {result.targetScore}</p>
                    <p>Difference : {result.difference}</p>
                    <h3>{result.recommendation}</h3>

                    <button onClick={() => navigate(`/chat/${cloth._id}`)}>  YES  </button>

                    <button
                    onClick={() => {
                    setShowCalculator(false);
                    setResult(null);
                    setSelectedItem("");
                    }}
                    >
                    NO
                    </button>
                    </div>

                    )
                    }
                    </div>
                    )
                }
            </div>
        </div>

    );

}

export default ItemDetails;
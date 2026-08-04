import {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/home.css";

function Home(){

const [clothes,setClothes]=useState([]);
const [location,setLocation]=useState("All");
const [notificationCount,setNotificationCount]=useState(0);
const [notifications,setNotifications]=useState([]);
const [showNotifications,setShowNotifications]=useState(false);

const navigate=useNavigate();

useEffect(() =>{
    fetchClothes();
},[location]);

useEffect(() =>{
    fetchNotificationCount();
},[]);


async function fetchNotificationCount(){
    try{
        const res=await axios.get(
            `${API}/notifications/count`,
            {
                withCredentials:true
            }
        );
        setNotificationCount(res.data.count);
    }
    catch(err){
        console.log(err);
    }
}



async function fetchNotifications(){
    try{
        const res=await axios.get(
            `${API}/notifications`,
            {
                withCredentials:true
            }
        );
        setNotifications(res.data);
    }
    catch(err){
        console.log(err);
    }
}


function openNotifications(){
    fetchNotifications();
    setShowNotifications(!showNotifications);
}


async function markRead(notification){
    await axios.patch(
        `${API}/${notification._id}`,
        {},
        {
            withCredentials:true
        }
    );
    fetchNotificationCount();
    fetchNotifications();
    navigate(`/chat/${notification.clothId}`);
}



const fetchClothes=async()=>{
try{
const res=await axios.get(`${API}/home?location=${location}`);
setClothes(res.data);
}
catch(err){
console.log(err);
}

};

return (

    <div className="home">
         <div
            className="profile-container"
            onClick={()=>navigate("/profile")} >
            👤
        </div>

        <div className="bell-container">
            <button onClick={openNotifications}>
                🔔
                {
                    notificationCount > 0 &&
                    <span className="badge">
                        {notificationCount}
                    </span>
                }
            </button>
        </div>
        {
            showNotifications &&
            <div className="notification-dropdown">
                {
                    notifications.map((item) => (
                        <div
                            key={item._id}
                            className="notification-item"
                            onClick={() => markRead(item)}
                        >
                            <b>{item.senderName}</b>
                            <p>{item.message}</p>
                        </div>
                    ))
                }
            </div>
        }

        <div className="filter-container">
            <label>Location : </label>

            <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}>

                <option value="All">All</option>
                <option value="Manglore"> Mangalore </option>
                <option value="Udupi"> Udupi </option>
                <option value="Manipal"> Manipal </option>
                <option value="Bhatkala"> Bhatkala</option>
                <option value="Delhi"> Delhi </option>
                <option value="Mumbai"> Mumbai </option>
                <option value="Chennai"> Chennai </option>
                <option value="Hyderabad"> Hyderabad </option>
                <option value="Jaipur"> Jaipur </option>
                <option value="Kolkata"> Kolkata </option>
                <option value="Lucknow"> Lucknow </option>
                <option value="Ahmedabad"> Ahmedabad </option>
                <option value="Surat"> Surat </option>
                <option value="Pune"> Pune </option>
            </select>

        </div>

        <h1>Available Clothes</h1>
        <div className="card-container">
            {
                clothes.map((cloth) => (
                    <div
                        className="card"
                        key={cloth._id}
                    >
                        <img
                            src={cloth.image}
                            alt={cloth.title}
                        />
                        <h2>{cloth.title}</h2>
                        <h4>
                            <p>Owner : {cloth.ownerName}</p>
                        </h4>
                        <p>Brand : {cloth.brand}</p>
                        <p>Category : {cloth.category}</p>
                        <p>Size : {cloth.size}</p>
                        <p>Condition : {cloth.condition}</p>
                        <p>Swap Value : {cloth.swapValue}</p>
                        <p>Location : {cloth.location}</p>
                        <p>
                            Status:
                            {cloth.isAvailable ? " 🟢 Available" : " 🔴 Swapped"}
                        </p>
                        <Link to={`/item/${cloth._id}`}>
                            View Details
                        </Link>
                    </div>
               ))
            }
        </div>
    </div>
);
}

export default Home;
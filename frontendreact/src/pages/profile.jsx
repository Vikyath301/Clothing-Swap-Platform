import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Profile.css";

function Profile(){
    const [profile,setProfile]=useState(null);
    const navigate=useNavigate();

    useEffect(()=>{
        fetchProfile();
    },[]);

    async function fetchProfile(){
        try{
            const res=await axios.get(
                `${API}/profile`,
                {
                    withCredentials:true
                }
            );
            setProfile(res.data);
        }
        catch(err){
            console.log(err);
        }
    }

    async function logout(){
        try{
            await axios.post(
                `${API}/logout`,
                {},
                {
                    withCredentials:true
                }
            );
            navigate("/login");
        }

        catch(err){
            console.log(err);
        }
    }

    if(profile===null){
        return <h2>Loading...</h2>;
    }

    return(

        <div className="profile-page">
            <div className="profile-card">
                <img
                    className="profile-image"
                    src={
                        profile.profilePic ? profile.profilePic : "/profile.png"
                    }
                    alt="Profile"
                />
                <h2>{profile.name}</h2>
                <p><b>Email :</b> {profile.email}</p>
                <p><b>Phone :</b> {profile.phone}</p>
                <p><b>Location :</b> {profile.location}</p>
                
                <div
                    className="pending-box"
                    onClick={() => navigate("/pendingDeals")}
                    style={{ cursor: "pointer" }}
                    >
                    <h3>Pending Deals</h3>
                    <h1>{profile.pendingDeals}</h1>
                </div>

                <h3>Swap History</h3>
                {
                    profile.swapHistory.length===0 ? <p>No Swaps Yet</p> :
                    profile.swapHistory.map((item)=>(
                        <div
                            className="swap-card"
                            key={item._id}>
                            <b>
                                {item.customerName}
                                {" ↔ "}
                                {item.ownerName}
                            </b>
                            <br/>
                            <small>
                                {
                                    new Date(item.updatedAt).toLocaleDateString()
                                }
                            </small>
                        </div>
                    ))
                }

                <button onClick={() => navigate("/my-Listings")}>
                    My Listings
                </button>

                <button onClick={() => navigate("/mydeals")}> My Deals </button>

                <button onClick={() => navigate("/upload")}> Upload Clothing  </button>

                <button
                    className="logout-btn"
                    onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;
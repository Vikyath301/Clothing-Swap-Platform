import {useEffect,useState} from "react";
import axios from "axios";

function Notification(){
    const [notifications,setNotifications]=useState([]);

    useEffect(()=>{
        fetchNotifications();
    },[]);

    async function fetchNotifications(){

        try{
            const res=await axios.get(
                "http://localhost:5000/notifications",
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

    async function markRead(id){
        await axios.patch(
            `http://localhost:5000/notifications/${id}`,
            {},

            {
                withCredentials:true
            }
        );
        fetchNotifications();
    }

    return(
        <div>
            <h1>Notifications</h1>
            {
                notifications.map((item)=>(
                    <div
                        key={item._id}
                        onClick={()=>markRead(item._id)}>
                        <b>{item.senderName}</b>
                        <p>{item.message}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default Notification;
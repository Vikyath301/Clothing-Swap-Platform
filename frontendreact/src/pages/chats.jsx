import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/chat.css";

const API = import.meta.env.VITE_API_URL;

function Chat() {

    const { clothId } = useParams();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchChats();
    }, []);

    async function fetchChats() {

        try {
            const res = await axios.get(
                `${API}/chat/${clothId}`,
                {
                    withCredentials: true
                }
            );
            setMessages(res.data);
        }

        catch (err) {
            console.log(err);
        }
    }

    async function sendMessage() {
        if (message.trim() === "") {
            return;
        }

        try {
            await axios.post(
                `${API}/chat/send`,
                {
                    clothId,
                    message
                },
                {
                    withCredentials: true
                }
            );

            setMessage("");
            fetchChats();
        }

        catch (err) {
            console.log(err);
        }
    }

    async function confirmDeal() {

        try {
            setLoading(true);
            const res = await axios.post(
                `${API}/deal/request`,
                {
                    clothId
                },

                {
                    withCredentials: true
                }
            );
            alert(res.data.message);
        }

        catch (err) {

            if (err.response) {
                alert(err.response.data.message);
            }
            else {
                alert("Something went wrong");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <div className="chat-container">
            <h1>Negotiation Chat</h1>
            <div className="chat-box">
                {
                    messages.map((chat) => (
                        <div
                            className="message"
                            key={chat._id}
                        >
                            <b>{chat.senderName}</b>
                            <p>{chat.message}</p>
                        </div>
                    ))
                }
            </div>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
            <button
                className="deal-btn"
                onClick={confirmDeal}
                disabled={loading}
            >
                {
                    loading
                        ?
                        "Sending..."
                        :
                        "Confirm Deal"
                }
            </button>
        </div>
    );
}

export default Chat;
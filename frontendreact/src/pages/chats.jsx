import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getSocket } from "../utils/socket";
import { showToast } from "../components/Toast";
import SwapCalculatorModal from "../components/SwapCalculatorModal";
import "../css/chat.css";

function Chat() {
  const { clothId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingDeal, setLoadingDeal] = useState(false);
  const [clothMeta, setClothMeta] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    fetchMetadata();
    fetchChats();

    const socket = getSocket();

    // Join room for this cloth's negotiation
    socket.emit("join_chat", clothId);

    const handleNewMessage = (newChat) => {
      setMessages((prev) => {
        // Prevent duplicate append
        if (prev.some((m) => m._id === newChat._id)) return prev;
        return [...prev, newChat];
      });
      scrollToBottom();
    };

    const handleUserTyping = ({ senderName }) => {
      setTypingUser(senderName || "Partner");
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      setIsTyping(false);
      setTypingUser("");
    };

    socket.on("chat_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.emit("leave_chat", clothId);
      socket.off("chat_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [clothId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMetadata = async () => {
    try {
      const res = await api.get(`/chat/meta/${clothId}`);
      setClothMeta(res.data.cloth);
      if (res.data.currentUser) {
        setCurrentUser(res.data.currentUser);
      }
    } catch (err) {
      // Fallback to basic item fetch
      try {
        const itemRes = await api.get(`/item/${clothId}`);
        setClothMeta(itemRes.data);
      } catch (e) {}
    }
  };

  const fetchChats = async () => {
    try {
      const res = await api.get(`/chat/${clothId}`);
      setMessages(res.data || []);
      scrollToBottom();
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    const socket = getSocket();
    socket.emit("typing", {
      clothId,
      senderName: currentUser?.name || "Participant"
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { clothId });
    }, 1500);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (message.trim() === "") return;

    const socket = getSocket();
    socket.emit("stop_typing", { clothId });

    try {
      const res = await api.post("/chat/send", {
        clothId,
        message: message.trim()
      });

      // Optimistically append if socket hasn't broadcasted yet
      if (res.data) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
      }
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.log(err);
      showToast("Unable to send message", "error");
    }
  };

  const confirmDeal = async () => {
    try {
      setLoadingDeal(true);
      const res = await api.post("/deal/request", { clothId });
      showToast(res.data.message || "Swap request sent!", "success");
      fetchMetadata();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoadingDeal(false);
    }
  };

  const isMyCloth = clothMeta && currentUser && (
    (clothMeta.ownerId === currentUser.id) || 
    (clothMeta.ownerId === currentUser._id) ||
    (clothMeta.ownerId?.toString() === currentUser.id?.toString()) ||
    (clothMeta.ownerId?.toString() === currentUser._id?.toString())
  );

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        {/* Negotiation Garment Header */}
        <div className="negotiation-header">
          {clothMeta ? (
            <div className="garment-negotiation-summary">
              <img 
                src={clothMeta.image} 
                alt={clothMeta.title} 
                className="summary-thumb" 
                onClick={() => navigate(`/item/${clothMeta._id}`)}
              />
              <div className="summary-info">
                <div className="summary-title-row">
                  <h3>{clothMeta.title}</h3>
                  <span className={`badge ${clothMeta.isAvailable ? "badge-success" : "badge-neutral"}`}>
                    {clothMeta.isAvailable ? "Available to Swap" : "Swapped"}
                  </span>
                </div>
                <div className="summary-meta-chips">
                  <span className="chip">🏷️ {clothMeta.brand}</span>
                  <span className="chip">📏 Size: {clothMeta.size}</span>
                  <span className="chip">✨ {clothMeta.condition}</span>
                  <span className="chip highlight">⚖️ {clothMeta.swapValue} pts</span>
                  <span className="chip">📍 {clothMeta.location}</span>
                </div>
                <p className="owner-text">
                  Listed by: <strong>{clothMeta.ownerName}</strong> {isMyCloth && "(You)"}
                </p>
              </div>

              <div className="header-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowCalculator(true)}
                  title="Check swap value compatibility"
                >
                  ⚖️ Value Parity
                </button>

                {!isMyCloth && clothMeta.isAvailable && (
                  <button
                    className="btn btn-sm btn-primary confirm-action-btn"
                    onClick={confirmDeal}
                    disabled={loadingDeal}
                  >
                    {loadingDeal ? "Submitting..." : "🤝 Propose Swap Deal"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="summary-loading">
              <h3>Real-Time Swap Negotiation</h3>
              <p>Discuss clothing conditions, swap points parity, and logistics</p>
            </div>
          )}
        </div>

        {/* Live Chat History */}
        <div className="chat-box">
          {messages.length === 0 ? (
            <div className="empty-chat-state">
              <span className="empty-icon">💬</span>
              <h4>Start the Negotiation</h4>
              <p>Propose which garment from your wardrobe you would like to trade, ask about fitting, or agree on swap details.</p>
            </div>
          ) : (
            messages.map((chat) => {
              const isMine = currentUser && (
                chat.senderId === currentUser.id ||
                chat.senderId === currentUser._id ||
                chat.senderId?.toString() === currentUser.id?.toString() ||
                chat.senderId?.toString() === currentUser._id?.toString()
              );

              return (
                <div
                  className={`chat-bubble-row ${isMine ? "outgoing" : "incoming"}`}
                  key={chat._id || Math.random()}
                >
                  <div className="chat-bubble">
                    <div className="bubble-header">
                      <span className="bubble-sender">
                        {isMine ? "You" : chat.senderName}
                      </span>
                      {chat.createdAt && (
                        <span className="bubble-time">
                          {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="bubble-text">{chat.message}</p>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
              <span className="typing-text">{typingUser} is typing</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form className="input-area" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type your message, counter-offer, or question..."
            value={message}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary send-btn" disabled={!message.trim()}>
            Send ➔
          </button>
        </form>
      </div>

      {showCalculator && (
        <SwapCalculatorModal 
          initialTargetItem={clothMeta}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}

export default Chat;
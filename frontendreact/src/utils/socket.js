import { io } from "socket.io-client";
import { SOCKET_URL } from "./api";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketInstance.on("connect", () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user.id || user._id) {
            socketInstance.emit("join_user", user.id || user._id);
          }
        } catch(e) {}
      }
    });
  }

  return socketInstance;
};

export default getSocket;

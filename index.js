
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://clothing-swap-platform-8vaq8q9u7-vikki9.vercel.app",
    "https://clothing-swap-platform-b3jqea7nv-vikki9.vercel.app",
    "https://clothing-swap-platform-m3qqn8k2r-vikki9.vercel.app",
    "https://clothing-swap-platform-chi.vercel.app"
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.includes("vercel.app")) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
});

app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.includes("vercel.app")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

// Real-time WebSockets negotiation & live updates
io.on("connection", (socket) => {
    // User joins personal notification room
    socket.on("join_user", (userId) => {
        if (userId) {
            socket.join(`user_${userId}`);
        }
    });

    // Join item negotiation room
    socket.on("join_chat", (clothId) => {
        if (clothId) {
            socket.join(clothId.toString());
        }
    });

    socket.on("leave_chat", (clothId) => {
        if (clothId) {
            socket.leave(clothId.toString());
        }
    });

    socket.on("typing", ({ clothId, senderName }) => {
        if (clothId) {
            socket.to(clothId.toString()).emit("user_typing", { senderName });
        }
    });

    socket.on("stop_typing", ({ clothId }) => {
        if (clothId) {
            socket.to(clothId.toString()).emit("user_stop_typing");
        }
    });
});

const registerRoutes = require("./backend/Register");
const loginRoutes = require("./backend/login");
const homeRoutes = require("./backend/home");
const itemDetailsRoutes = require("./backend/itemDetails");
const clothRoutes = require("./backend/chat");
const notificationRoutes = require("./backend/notification");
const dealRoutes = require("./backend/deal");
const profileRoute = require("./backend/profile");
const myListings = require("./backend/myListings");
const uploadRoutes = require("./backend/upload");
const swapRoute = require("./backend/swapValue");
const manageuser = require("./backend/manageUser");
const manageListing = require("./backend/manageListing");
const manageDispute = require("./backend/manageDispute");
const Dispute = require("./backend/dispute");

app.use(Dispute);
app.use(manageDispute);
app.use(manageListing);
app.use(manageuser);
app.use(swapRoute);
app.use(uploadRoutes);
app.use(myListings);
app.use(notificationRoutes);
app.use(clothRoutes);
app.use(dealRoutes);
app.use(homeRoutes);
app.use(registerRoutes);
app.use(loginRoutes);
app.use(itemDetailsRoutes);
app.use(profileRoute);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server and WebSockets running on port ${PORT}`);
});
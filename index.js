
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin:[ 
        "http://localhost:5174",
        "http://localhost:5173",
    ],
        
    credentials: true
}));

const registerRoutes = require("./backend/Register");
const loginRoutes = require("./backend/login");
const homeRoutes=require("./backend/home");
const itemDetailsRoutes = require("./backend/itemDetails");
const clothRoutes=require("./backend/chat");
const notificationRoutes = require("./backend/notification");
const dealRoutes = require("./backend/deal");
const profileRoute = require("./backend/profile");
const myListings = require("./backend/myListings");
const uploadRoutes= require("./backend/upload")
const swapRoute=require("./backend/swapValue");
const manageuser=require("./backend/manageUser");
const manageListing=require("./backend/manageListing");
const manageDispute=require("./backend/manageDispute");
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
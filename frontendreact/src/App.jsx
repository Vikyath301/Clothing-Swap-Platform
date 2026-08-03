import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import Chat from "./pages/chats";
import ItemDetails from "./pages/itemDetails";
import PendingDeals from "./pages/pendingDeals";
import MyDeals from "./pages/myDeals";
import Profile from "./pages/profile";
import MyListings from "./pages/myListings";
import EditListing from "./pages/editListing";
import Upload from "./pages/uploadClothing"
import Admin from "./pages/admin";
import ManageUsers from "./pages/manageUser";
import ManageListing from "./pages/manageListing";
import Analytics from "./pages/analytics";
import SwapActivities from "./pages/swapActivities";
import ManageDispute from "./pages/manageDispute"




function App(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/item/:id" element={<ItemDetails />}/>
                <Route path="/chat/:clothId" element={<Chat />} />
                <Route path="/pendingDeals" element={<PendingDeals/>} />
                <Route path="/myDeals" element={<MyDeals/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/my-Listings" element={<MyListings/>} />
                <Route path="/edit/:id" element={<EditListing />} />
                <Route path="/upload"  element={<Upload />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/listings" element={<ManageListing />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/swaps" element={<SwapActivities />} />
                <Route path="/admin/disputes" element={<ManageDispute />} />
            </Routes>
        </BrowserRouter>
    

    )

}

export default App;
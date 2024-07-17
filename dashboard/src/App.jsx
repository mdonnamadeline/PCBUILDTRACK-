import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ManageUser from "./pages/ManageUser";
import Menu from "./pages/Menu";
import ManageProducts from "./pages/ManageProducts";
import Sidebar from "./pages/Sidebar";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Location from "./pages/Location";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/sidebar"element={<Sidebar />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/manageuser" element={<ManageUser />} />
                <Route path="/manageproduct" element={<ManageProducts />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/location" element={<Location />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
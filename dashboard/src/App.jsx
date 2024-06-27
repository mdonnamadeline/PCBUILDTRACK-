import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ManageUser from "./pages/ManageUser";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/home" element={<Home />} />
                <Route path="/product" element={<Product />} />
                <Route path="/manageuser" element={<ManageUser />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
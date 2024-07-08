import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const isAdminOrOwner = user && (user.role === "Admin" || user.role === "Owner");
    const isLoggedIn = Boolean(user);

    const navigate = useNavigate();
    const handleHome = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="navbar">
            <div className="navbar-items">
                <img
                    src={logo}
                    alt="Logo"
                    style={{ marginRight: "auto" }}
                    onClick={handleHome}
                />
                <div
                    className="navbar-items-section"
                    style={{
                        display: "flex",
                        gap: "50px",
                        justifyContent: "flex-end",
                        marginRight: "40px",
                    }}
                >
                     {isLoggedIn ? (
                    <>
                        {isAdminOrOwner ? (
                            <>
                                <Link to="/manageuser">Manage User</Link>
                                <Link to="/manageproduct">Manage Product</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/home">Home</Link>
                                <Link to="/menu">Menu</Link>
                            </>
                        )}
                        <a href="#" onClick={handleLogout}>
                            Logout
                        </a>
                    </>
                ) : (
                    <>
                        <Link to="/home">Home</Link>
                        <Link to="/menu">Menu</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}

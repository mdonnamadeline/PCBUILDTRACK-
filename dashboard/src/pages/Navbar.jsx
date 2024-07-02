import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdminOrOwner =
        user && (user.role === "Admin" || user.role === "Owner");
    const isLoggedIn = true;

    console.log("User:", user);
    console.log("Is Admin or Owner:", isAdminOrOwner);

    const navigate = useNavigate();
    const handleHome = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        console.log("Logging out...");
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
                    
                    {isAdminOrOwner ? (
                        <>
                            <Link to="/manageuser">MANAGE USER</Link>
                            <Link to="/manageproduct">MANAGE PRODUCT</Link>
                            <a href="#" onClick={handleLogout}>
                                LOGOUT
                            </a>
                        </>
                    ) : (
                        <>
                            <Link to="/home">HOME</Link>
                            <Link to="/menu">MENU</Link>
                            {isLoggedIn ? (
                                <a href="#" onClick={handleLogout}>
                                    LOGOUT
                                </a>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

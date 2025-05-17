import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";

export default function Navbar({ cartItemCount }) {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        if (storedUser) {
            const storedCartItems =
                JSON.parse(localStorage.getItem("cartItems")) || [];
            const count = storedCartItems.reduce(
                (total, item) => total + item.quantity,
                0
            );
            setCartCount(count);
        }
    }, []);

    const isAdminOrOwner =
        user && (user.role === "Admin" || user.role === "Owner");
    const isLoggedIn = Boolean(user);

    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear();
        window.location.href = "/login";
        setUser(null);
        setCartCount(0);
        navigate("/home");
    };

    const handleCartClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("Your cart is empty. Please sign in first.");
        }
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
                                    <Link to="/home">Home</Link>
                                    <Link to="/menu">Menu</Link>
                                    {/* <Link to="/manageuser">Manage User</Link>
                                    <Link to="/manageproduct">
                                        Manage Product
                                    </Link> */}
                                    
                                </>
                            ) : (
                                <>
                                    <Link to="/home">Home</Link>
                                    <Link to="/menu">Menu</Link>
                                    <Link to="/contactus">Contact Us</Link> {/* Added Contact Us */}
                                </>
                            )}
                            <Link to="/cart" onClick={handleCartClick}>
                                <Badge
                                    badgeContent={cartItemCount}
                                    color="error"
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </Link>
                            <a href="#" onClick={handleLogout}>
                                Logout
                            </a>
                        </>
                    ) : (
                        <>
                            <Link to="/home">Home</Link>
                            <Link to="/menu">Menu</Link>
                            <Link to="/contactus">Contact Us</Link> {/* Added Contact Us */}
                            <Link to="/login">Login</Link>
                            <Link to="/cart" onClick={handleCartClick}>
                                <ShoppingCartIcon />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
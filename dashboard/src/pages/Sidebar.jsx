import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../images/logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Sidebar() {
    const handleHome = () => {
        navigate("/home");
    };

    const handleCartClick = (e) => {
      if (!isLoggedIn) {
          e.preventDefault();
          alert("Your cart is empty. Please sign in first.");
      }
  };
    return (
        <div className="sidebar">
            <div className="sidebar-items">
                <img
                    src={logo}
                    alt="Logo"
                    style={{ marginRight: "auto" }}
                    onClick={handleHome}
                />
                <Link to="/home" className="sidebar-item">
                    Home
                </Link>
                <Link to="/menu" className="sidebar-item">
                    Menu
                </Link>
                <Link to="/manageuser" className="sidebar-item">
                    MANAGE USER
                </Link>
                <Link to="/manageproduct" className="sidebar-item">
                    MANAGE PRODUCT
                </Link>
                <Link to="/cart" onClick={handleCartClick} className="sidebar-item">
                    <ShoppingCartIcon />
                </Link>
                <Link to="/accounting" className="sidebar-item">
                    INVENTORY
                </Link>
                <Link to="/login" className="sidebar-item">
                    LOGOUT
                </Link>
            </div>
        </div>
    );
}

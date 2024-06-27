import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar() {
  return (
    <div className="navbar">
        <div className="navbar-items">
        <img src={logo} alt="Logo" style={{ marginRight: "auto" }} /> 
            <div
                className="navbar-items-section"
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginRight: "40px",
                }}
            >
                <Link to="/mateo">HOME</Link>
                <Link to="/product">PRODUCTS</Link>
                <Link to="/login">LOGIN</Link>
              
            </div>
        </div>
    </div>
);
}

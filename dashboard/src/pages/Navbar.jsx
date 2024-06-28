import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar() {

    const navigate = useNavigate();
    const handleHome = () => {
        navigate("/home");
    };

  return (
    <div className="navbar">
        <div className="navbar-items">
        
        <img src={logo} alt="Logo" style={{ marginRight: "auto" }} onClick={handleHome}/> 
        
        
            <div
                className="navbar-items-section"
                style={{
                    display: "flex",
                    gap: "50px",
                    justifyContent: "flex-end",
                    marginRight: "40px",
                }}
            >
                <Link to="/home">HOME</Link>
                <Link to="/menu">MENU</Link>
                <Link to="/manageuser">MANAGE USER</Link>
                <Link to="/manageproduct">MANAGE PRODUCT</Link>
                <Link to="/login">LOGIN</Link>
                <Link to="/login">LOGOUT</Link>
              
            </div>
        </div>
    </div>
);
}

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../images/logo.png";

export default function Sidebar() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const userRole = userData ? userData.role : null;

    // Function to determine which links to display based on the user role
    const renderLinks = () => {
        if (userRole === "Staff") {
            return (
                <>
                    <Link to="/manageproduct" className="sidebar-item">
                        PRODUCT INVENTORY
                    </Link>
                    <Link to="/businesstobusiness" className="sidebar-item">
                        PARTNERS
                    </Link>
                    <Link to="/reports" className="sidebar-item">
                        REPORTS
                    </Link>
                    <Link to="/login" className="sidebar-item">
                        LOGOUT
                    </Link>
                </>
            );
        } else {
            // Default to showing all links for Admins or other roles
            return (
                <>
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
                        PRODUCT INVENTORY
                    </Link>
                    <Link to="/businesstobusiness" className="sidebar-item">
                        YOU BILI DITO
                    </Link>
                    <Link to="/reports" className="sidebar-item">
                        REPORTS
                    </Link>
                    <Link to="/login" className="sidebar-item">
                        LOGOUT
                    </Link>
                </>
            );
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-items">
                <Link to="/dashboard">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ marginRight: "auto" }}
                    />
                </Link>
                {renderLinks()}
            </div>
        </div>
    );
}

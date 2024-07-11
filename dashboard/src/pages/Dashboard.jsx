import React from "react";
import Sidebar from './Sidebar' ;
// import Navbar from "./Navbar";
import './Dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard">
            <Sidebar />
            {/* <Navbar /> */}
            <div className="con">
                <h1>ADMIN DASHBOARD</h1>
            </div>
        </div>
    );
}

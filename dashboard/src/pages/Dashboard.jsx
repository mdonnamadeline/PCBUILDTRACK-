import React from "react";
import Sidebar from './Sidebar' ;
// import Navbar from "./Navbar";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <Sidebar />
            {/* <Navbar /> */}
            <div className="con">
                <h1>ADMIN DASHBOARD</h1>
                <p>Welcome Admin!</p>
            </div>
        </div>
    );
}

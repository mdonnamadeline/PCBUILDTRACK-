import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import imageH1 from "../images/imageH1.jpg";
import imageH2 from "../images/imageH2.jpg";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsResponse = await axios.get(
                    "http://localhost:1337/api/projects/KFC"
                );
                setProjects(projectsResponse.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="home">
            <Navbar />
            <div className="homecon">
                <div className="imageContainer">
                    <img src={imageH1} alt="Image 1" className="landscapeImage" />
                    <img src={imageH2} alt="Image 2" className="landscapeImage" />
                </div>
                <div className="footer">
                    <div className="footerSection">
                        <h3>ADDRESS</h3>
                        <p>Branches</p>
                    </div>
                    <div className="footerSection">
                        <h3>SITEMAP</h3>
                        <Link to="/home"><p>Home</p></Link>
                        <Link to="/menu"><p>Browse Product</p></Link>
                        <p>Contact Us</p>
                    </div>
                    <div className="footerSection">
                        <h3>About PCBuild Track</h3>
                        <Link to="/signup"><p>Register</p></Link>
                        <Link to="/login"><p>Login</p></Link>
                    </div>
                    <div className="footerCopyright">
                        <p>Copyright © 2010-2025 PCBuild Track. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
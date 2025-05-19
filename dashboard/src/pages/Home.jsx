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
                    "http://localhost:1337"
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
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <h1>Build Your Dream PC</h1>
                        <p>Create, customize, and track your perfect PC build with PCBuild Track</p>
                        <Link to="/menu" className="cta-button">Start Building</Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <h2>Why Choose PCBuild Track?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <i className="fas fa-tools"></i>
                            <h3>Custom Builds</h3>
                            <p>Design your PC with our easy-to-use builder</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-chart-line"></i>
                            <h3>Price Tracking</h3>
                            <p>Monitor component prices in real-time</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-check-circle"></i>
                            <h3>Compatibility Check</h3>
                            <p>Ensure all your components work together</p>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="imageContainer">
                    <img src={imageH1} alt="Image 1" className="landscapeImage" />
                    <img src={imageH2} alt="Image 2" className="landscapeImage" />
                </div>

                {/* Footer */}
                <div className="footer">
                    <div className="footerSection">
                        <h3>ADDRESS</h3>
                        <p>Branches</p>
                    </div>
                    <div className="footerSection">
                        <h3>SITEMAP</h3>
                        <Link to="/home"><p>Home</p></Link>
                        <Link to="/menu"><p>Browse Product</p></Link>
                        <Link to="/contactus"><p>Contact Us</p></Link>
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
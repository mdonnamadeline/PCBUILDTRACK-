import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Grid } from "@mui/material";
import Navbar from "./Navbar";
import Zinger from "../images/zinger.jpg";
import Dasurv from "../images/dasurv.jpg";
import "../styles/Home.css";
import "../styles/Business.css";

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
            <div className="">
                {/* //add contegories */}
           
            <div className="homecon">
                <img src={Zinger} alt="Zinger" />
                <img src={Dasurv} alt="Dasurv" />
            </div>    
            </div>
            </div>
    );
}
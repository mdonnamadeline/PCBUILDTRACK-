import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from "@mui/material";
import "./Menu.css";

export default function Menu() {
    const [menu, setMenu] = useState([]);
    const { VITE_REACT_APP_API_HOST } = import.meta.env;


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${ VITE_REACT_APP_API_HOST }/viewmenu`);
            if (response.data && response.data.data) {
                setMenu(response.data.data);
            } else {
                console.error("Invalid data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const renderSection = (title, category) => (
        <div className="menu-section" id={category}>
            <h2>{title}</h2>
            <div className="menu-list">
                {menu
                    .filter((dish) => dish.category === category)
                    .map((dish) => (
                        <ProductCard key={dish.id} dish={dish} />
                    ))}
            </div>
        </div>
    );

    return (
        <div className="menu">
            <Navbar />
            <div className="menu-main">
                <h1 className="menu-Title">So Good! Order Now!</h1>
            </div>
            <div className="section-menu">
                {renderSection("What's Hot", "whats-hot")}
                {renderSection("Secret Menu", "secret-menu")}
                {renderSection("Chicken Meals", "chicken-meals")}
                {renderSection("Sandwiches", "sandwiches")}
                {renderSection("Breakfast Meals", "breakfast-meals")}
                {renderSection("Desserts", "desserts")}
                {renderSection("Drinks", "drinks")}
            </div>
        </div>
    );
}

function ProductCard({ dish }) {
    const imageUrl = `http://localhost:1337/${dish.image}`;

    return (
        <Card className="product-card">
            <CardHeader
                title={<div style={{ whiteSpace: "nowrap" }}>{dish.name}</div>}
                subheader={`₱${dish.price}`}
            />
            <CardMedia
                component="img"
                height="194"
                image={imageUrl}
                alt={dish.name}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {dish.description}
                </Typography>
            </CardContent>
        </Card>
    );
}


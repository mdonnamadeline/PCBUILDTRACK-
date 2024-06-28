import React, { useState, useEffect } from "react";
import "./Menu.css";
import Navbar from "./Navbar";

export default function Menu() {
    const [menu, setMenu] = useState([]);

    const fetchMenu = async () => {
        try {
            const response = await fetch("http://localhost:1337/get-menu");
            const data = await response.json();
            if (data && data.data) {
                setMenu(data.data);
            } else {
                console.error("Invalid data format:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const renderSection = (title, category) => (
        <div className="menu-section" id={category}>
            <h2>{title}</h2>
            <div className="image-container">
                {menu
                    .filter((dish) => dish.category === category)
                    .map((dish, index) => (
                        <div key={dish.id || index} className="image-item">
                            <img
                                src={`data:image/jpeg;base64,${dish.image}`}
                                alt={dish.name}
                            />
                            <div className="image-text">{dish.name}</div>
                            <div className="image-text">₱ {dish.price}</div>
                            <div className="image-text">{dish.description}</div>
                        </div>
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

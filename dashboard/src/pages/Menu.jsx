import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from "@mui/material";
import "./Menu.css"; // Import the CSS file

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/viewmenu`
            );
            setDataList(response.data.data || []); // Ensure accessing the nested data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="menu">
            <Navbar className="NavBar" />
            <div className="menu-main">
                <h1 className="menu-Title">MENU</h1>
                <div className="menu-list">
                    {dataList.length > 0 ? (
                        dataList
                            .filter((menu) => !menu.disabled)
                            .map((menu) => (
                                <ProductCard key={menu._id} menu={menu} />
                            ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCard({ menu }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    return (
        <Card className="product-card">
            <CardHeader
                title={
                    <div style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
                        {menu.name}
                    </div>
                }
                subheader={`₱${menu.price}`}
            />
            <CardMedia
                component="img"
                height="100" 
                image={imageUrl}
                alt={menu.name}
            />
            <CardContent>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    style={{ fontSize: "12px" }} 
                >
                    {menu.description}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px", width: "300px", color: "white", backgroundColor: "red" }}
                >
                    Order Now
                </Button>
            </CardContent>
        </Card>
    );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
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
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${VITE_REACT_APP_API_HOST}/viewmenu`);
            setDataList(response.data.data || []); // Ensure accessing the nested data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="menu">
            <Navbar />
            <div className="menu-main">
                <h1 className="menu-Title">MENU</h1>
                <div className="menu-list">
                    {dataList.length > 0 ? (
                        dataList
                            .filter((menu) => !menu.disabled)
                            .map((menu) => (
                                <ProductCard key={menu._id} menu={menu} user={user} navigate={navigate} />
                            ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCard({ menu, user, navigate }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    const handleButtonClick = () => {
        if (user) {
            navigate(`/add-to-order/${menu._id}`);
        } else {
            navigate("/login");
        }
    };

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
                    onClick={handleButtonClick}
                >
                    {user ? "Add to Order" : "Order Now"}
                </Button>
            </CardContent>
        </Card>
    );
}

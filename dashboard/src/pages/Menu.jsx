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

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${VITE_REACT_APP_API_HOST}/viewmenu`);
            setDataList(response.data.data || []);  // Make sure to access `data.data` to get the correct array
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <h1>MENU</h1>
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
                title={<div style={{ whiteSpace: "nowrap" }}>{menu.name}</div>}
                subheader={`₱${menu.price}`}
            />
            <CardMedia
                component="img"
                height="194"
                image={imageUrl}
                alt={menu.name}
            />
            <CardContent>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                >
                    {menu.description}
                </Typography>
            </CardContent>
        </Card>
    );
}

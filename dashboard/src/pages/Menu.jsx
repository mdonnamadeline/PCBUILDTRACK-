import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    Typography,
} from "@mui/material";

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const initialData = {
        name: "",
        description: "",
        image: "",
        price: "",
        disabled: false,
    };
    const [currentData, setCurrentData] = useState(initialData);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await getMenuList();
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function getMenuList() {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/viewmenu`)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    return (
        <div className="page-container">
            <Navbar />

            <div className="content">
                <h1>MENU</h1>
                <div className="menu-list">
                    {Array.isArray(dataList) ? (
                        dataList
                            .filter((menu) => !menu.disabled)
                            .map((menu, index) => (
                                <ProductCard key={index} menu={menu} />
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
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    return (
        <Card className="product-card">
            <CardHeader
                title={<div style={{ whiteSpace: "nowrap" }}>{menu.name}</div>}
                subheader={`₱${menu.price}`}
            ></CardHeader>
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

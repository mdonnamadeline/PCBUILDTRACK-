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
    Modal,
    Box,
} from "@mui/material";
import "./Menu.css";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 15,
    p: 2,
};

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [dataList, setDataList] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/viewmenu`
            );
            setDataList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                                <ProductCard
                                    key={menu._id}
                                    menu={menu}
                                    user={user}
                                    navigate={navigate}
                                    handleOpen={handleOpen}
                                />
                            ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Register first!
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        You need to sign up or login to place an order.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/signup")}
                        sx={{
                            mt: 2,
                            mr: 2,
                            backgroundColor: "rgb(161,27,27)",
                            "&:hover": { backgroundColor: "rgb(135,22,22)" },
                        }}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                        sx={{
                            mt: 2,
                            backgroundColor: "rgb(161,27,27)",
                            "&:hover": { backgroundColor: "rgb(135,22,22)" },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

function ProductCard({ menu, user, navigate, handleOpen }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    const handleButtonClick = () => {
        if (user) {
            navigate(`/add-to-order/${menu._id}`);
        } else {
            handleOpen();
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
                    style={{
                        marginTop: "10px",
                        width: "300px",
                        color: "white",
                        backgroundColor: "red",
                    }}
                    onClick={handleButtonClick}
                >
                    {user ? "Add to Order" : "Order Now"}
                </Button>
            </CardContent>
        </Card>
    );
}

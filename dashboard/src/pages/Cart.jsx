import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    IconButton,
    Checkbox,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import DeleteIcon from "@mui/icons-material/Delete";
import "./Navbar.css";
import "./Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(storedCartItems);
    }, []);

    useEffect(() => {
        // Check if the user is logged in
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login"); // Redirect to login page if not logged in
        }
    }, [navigate]);

    const handleSelectItem = (item) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(item)
                ? prevSelectedItems.filter((i) => i !== item)
                : [...prevSelectedItems, item]
        );
    };

    const handleDeleteItem = (item) => {
        const updatedCartItems = cartItems.filter((i) => i !== item);
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i !== item));
        }
    };

    const handleProceedToPayment = () => {
        if (selectedItems.length > 0) {
            navigate("/payment", {
                state: { cartItems: selectedItems },
            });
        } else {
            alert("Please select at least one item to proceed.");
        }
    };

    const getTotalAmount = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
      <>
      <Navbar />
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            {cartItems.length > 0 ? (
                <>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Date Added</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItems.includes(item)}
                                            onChange={() => handleSelectItem(item)}
                                        />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₱{item.price}</TableCell>
                                    <TableCell>{item.addedDate}</TableCell>
                                    <TableCell>₱{item.price * item.quantity}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteItem(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Total Amount: ₱{getTotalAmount()}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleProceedToPayment}
                        className="proceed-to-payment-button" 
                    >
                        Proceed to Payment
                    </Button>
                </Box>
                </>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Your cart is empty. <br />
                    Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to add items to your cart.
                </Typography>
            )}
        </div>
        </>
    );
}

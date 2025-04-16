import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Navbar from "./Navbar";
import "../styles/Payment.css";
import axios from "axios";

export default function Payment() {
    const [bank, setBank] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const totalAmount = location.state?.totalAmount || 0;

    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }
    };

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const getCustomerId = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? user._id : null;
    };

    const handleCheckout = async () => {
        // Clear any previous error
        setErrorMessage("");
        
        // Validate inputs
        if (!bank) {
            setErrorMessage("Please select a bank.");
            return;
        }

        const customerId = getCustomerId();
        if (!customerId) {
            setErrorMessage("Customer ID is required. Please login again.");
            return;
        }

        // Start processing
        setIsProcessing(true);
        
        const productNames = cartItems.map((item) => item.name).join(", ");
    
        const transactionData = {
            customerId,
            productName: productNames,
            quantity: cartItems.length,
            price: totalAmount,
            date: new Date().toISOString(),
            bank: bank
        };
    
        try {
            console.log("Saving transaction...", transactionData);
            // Save transaction to the database
            await axios.post(`${VITE_REACT_APP_API_HOST}/api/reports`, transactionData);
            
            console.log("Updating stock quantities...");
            // Update stock quantities for each purchased item
            await Promise.all(
                cartItems.map(async (item) => {
                    try {
                        await axios.put(`${VITE_REACT_APP_API_HOST}/api/menu/update-stock`, {
                            productId: item.id,
                            quantity: item.quantity
                        });
                    } catch (error) {
                        console.error(`Error updating stock for product ${item.name}:`, error);
                    }
                })
            );
    
            // Simulate payment success
            setOpen(true);
            clearCart();
        } catch (error) {
            console.error("Error during checkout:", error);
            setErrorMessage("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const clearCart = () => {
        localStorage.removeItem("cartItems");
        localStorage.setItem("cartCount", 0);
    };

    const handleClose = () => {
        setOpen(false);
        navigate("/");
    };

    return (
        <>
            <Navbar />
            <Box className="payment-container">
                <Typography className="payment-title" variant="h4" gutterBottom>
                    Payment
                </Typography>
                <Card className="payment-form">
                    <CardContent>
                        <FormControl component="fieldset">
                            <Typography variant="subtitle1" gutterBottom>
                                Select Bank
                            </Typography>
                            <RadioGroup value={bank} onChange={handleBankChange}>
                                <FormControlLabel
                                    value="Union Bank"
                                    control={<Radio />}
                                    label="Union Bank"
                                />
                                <FormControlLabel
                                    value="Metro Bank"
                                    control={<Radio />}
                                    label="Metro Bank"
                                />
                            </RadioGroup>
                        </FormControl>
                        
                        {errorMessage && (
                            <Typography 
                                variant="body2" 
                                color="error" 
                                style={{ marginTop: '8px' }}
                            >
                                {errorMessage}
                            </Typography>
                        )}
                        
                        <Typography
                            className="payment-summary-text"
                            variant="h6"
                            gutterBottom
                            style={{ marginTop: '16px' }}
                        >
                            Total Amount: ₱{totalAmount}
                        </Typography>
                        
                        <Button
                            className="payment-button"
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            style={{ marginTop: '16px' }}
                        >
                            {isProcessing ? "Processing..." : "Checkout"}
                        </Button>
                    </CardContent>
                </Card>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle className="payment-success-title">
                        Payment Successful
                    </DialogTitle>
                    <DialogContent className="center-content">
                        <DialogContentText className="dialog-content-text">
                            The payment of ₱{totalAmount} was successfully made
                            using {bank}.
                            <span className="thank-you-text">Thank You!</span>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="center-content">
                        <Button
                            onClick={handleClose}
                            color="primary"
                            className="red-text-button"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
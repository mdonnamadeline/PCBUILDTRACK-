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
    TextField, // Import TextField
} from "@mui/material";
import Navbar from "./Navbar";
import "../styles/Payment.css";
import axios from "axios";

export default function Payment() {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState(""); // State for account number
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

    // Handler for account number input change
    const handleAccountNumberChange = (event) => {
        // Allow only digits and limit length
        const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 9) {
            setAccountNumber(value);
        }
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

        // Validate Account Number
        if (!accountNumber || accountNumber.length !== 9) {
            setErrorMessage("Please enter a valid 9-digit account number.");
            return;
        }

        const customerId = getCustomerId();
        if (!customerId) {
            setErrorMessage("Customer ID is required. Please login again.");
            return;
        }

        // Start processing
        setIsProcessing(true);

        try {
            // Process each cart item individually
            for (const item of cartItems) {
                const transactionData = {
                    customerId,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price * item.quantity,
                    date: new Date().toISOString(),
                    bank: bank,
                    // Optionally include accountNumber if needed by the backend
                    // accountNumber: accountNumber,
                };

                console.log("Saving transaction for item:", item.name, transactionData);
                // Save individual transaction to the database
                await axios.post(
                    `${VITE_REACT_APP_API_HOST}/api/reports`,
                    transactionData
                );
            }

            console.log("Updating stock quantities...");
            // Update stock quantities
            await Promise.all(
                cartItems.map(async (item) => {
                    try {
                        await axios.put(
                            `${VITE_REACT_APP_API_HOST}/api/menu/update-stock`,
                            {
                                productId: item.id,
                                quantity: item.quantity,
                            }
                        );
                    } catch (error) {
                        console.error(
                            `Error updating stock for product ${item.name}:`,
                            error.response?.data || error.message
                        );
                    }
                })
            );

            // Payment success simulation
            setOpen(true);
            clearCart();
        } catch (error) {
            console.error("Error during checkout:", error);
            const errorMsg =
                error.response?.data?.message ||
                "Payment failed. Please try again.";
            setErrorMessage(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const clearCart = () => {
        // Keep user logged in, just clear cart related items
        localStorage.removeItem("cartItems");
        localStorage.setItem("cartCount", 0);
        // Optionally update Navbar state if needed immediately
    };

    const handleClose = () => {
        setOpen(false);
        navigate("/"); // Navigate to home or dashboard after closing dialog
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
                        {/* Bank Selection */}
                        <FormControl component="fieldset" fullWidth margin="normal">
                            <Typography variant="subtitle1" gutterBottom>
                                Select Bank
                            </Typography>
                            <RadioGroup row value={bank} onChange={handleBankChange}>
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

                        {/* Account Number Input */}
                        <TextField
                            label="Account Number (9 digits)"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={accountNumber}
                            onChange={handleAccountNumberChange}
                            inputProps={{
                                inputMode: 'numeric', // Helps mobile keyboards show numbers
                                pattern: '[0-9]*',   // Basic pattern for numbers
                                maxLength: 9,        // HTML5 max length
                            }}
                            required // Mark field as required
                        />

                        {/* Error Message Display */}
                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                style={{ marginTop: '8px', marginBottom: '8px' }}
                            >
                                {errorMessage}
                            </Typography>
                        )}

                        {/* Total Amount Display */}
                        <Typography
                            className="payment-summary-text"
                            variant="h6"
                            gutterBottom
                            style={{ marginTop: '16px' }}
                        >
                            Total Amount: ₱{totalAmount.toFixed(2)} {/* Ensure formatting */}
                        </Typography>

                        {/* Checkout Button */}
                        <Button
                            className="payment-button"
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            disabled={isProcessing || !bank || accountNumber.length !== 9} // Disable if processing or inputs invalid
                            fullWidth // Make button full width
                            style={{ marginTop: '16px' }}
                        >
                            {isProcessing ? "Processing..." : "Checkout"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Success Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle className="payment-success-title">
                        Payment Successful
                    </DialogTitle>
                    <DialogContent className="center-content">
                        <DialogContentText className="dialog-content-text">
                            The payment of ₱{totalAmount.toFixed(2)} was successfully processed
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
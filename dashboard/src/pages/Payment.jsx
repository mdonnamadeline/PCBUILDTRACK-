import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import Navbar from "./Navbar";
import "./Payment.css";

export default function Payment() {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const totalAmount = location.state?.totalAmount || 0;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }
    }, [navigate]);

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleCheckout = () => {
        console.log("Bank:", bank);
        console.log("Account Number:", accountNumber);
        console.log("Cart Items:", cartItems);
        console.log("Total Amount:", totalAmount);
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
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                        <Typography className="payment-summary-text" variant="h6" gutterBottom>
                            Total Amount: ₱{totalAmount}
                        </Typography>
                        <Button
                            className="payment-button"
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

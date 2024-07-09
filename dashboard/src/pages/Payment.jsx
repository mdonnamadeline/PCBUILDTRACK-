import React, { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Navbar from './Navbar'; 
import "./Payment.css";

const Payment = () => {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");
    const cartItems = window.history.state?.cartItems || []; 

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleCheckout = () => {
        console.log("Bank:", bank);
        console.log("Account Number:", accountNumber);
        console.log("Password:", password);
        console.log("Cart Items:", cartItems);
    };

    return (
      <>
      <Navbar />
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            padding="20px"
        >
            <Typography variant="h4" gutterBottom>
                Payment
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Bank</InputLabel>
                <Select value={bank} onChange={handleBankChange} label="Bank">
                    <MenuItem value="Union Bank">Union Bank</MenuItem>
                    <MenuItem value="Metro Bank">Metro Bank</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
            />
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                style={{ marginTop: "20px" }}
            >
                Checkout
            </Button>
        </Box>
      </>
    );
};

export default Payment;

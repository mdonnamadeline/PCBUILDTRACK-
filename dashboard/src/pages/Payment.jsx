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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Navbar from "./Navbar";
import "./Payment.css";
import axios from "axios";

export default function Payment() {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const totalAmount = location.state?.totalAmount || 0;
    const [values, setValues] = useState({
        debitAccount: "",
        creditAccount: "000000015",
        amount: totalAmount,
    });

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

    const handleCheckout = async () => {
        const token =
          "$2b$10$utpivAVbFbcbRTDsX96OEuyk7a1iZJVjQSXglpwNtH6n72dReGD0i";
      
        // Prepare transaction data
        const transactionData = {
          productName: 'Sample Product', 
          quantity: cartItems.length, 
          price: totalAmount, 
          date: new Date().toISOString(),
          bank: bank 
        };
      
        // Save transaction
        try {
          await axios.post(`${VITE_REACT_APP_API_HOST}/save-transaction`, transactionData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error saving transaction:', error);
          return; // Stop further execution if there's an error
        }
      
        // Handle payment processing
        try {
          const res = await axios.post(
            `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (res?.data?.success) {
            setOpen(true);
            clearCart();
          }
        } catch (error) {
          console.error('Error during payment:', error);
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
                            <RadioGroup
                                value={bank}
                                onChange={handleBankChange}
                            >
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
                            value={values?.debitAccount}
                            onChange={(e) => {
                                setValues((prev) => ({
                                    ...prev,
                                    debitAccount: e.target.value,
                                }));
                            }}
                        />
                        <Typography
                            className="payment-summary-text"
                            variant="h6"
                            gutterBottom
                        >
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

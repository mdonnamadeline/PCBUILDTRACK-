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
import axios from 'axios'

export default function Payment() {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const totalAmount = location.state?.totalAmount || 0;
    const [values, setValues] = useState({
        debitAccount: "",
        creditAccount: "000000015",
        amount: totalAmount,
    });

    useEffect(() => {
        fetchCredentials()
    }, []);

    const fetchCredentials = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }     
    }

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleCheckout = async() => {
        const token = '$2b$10$utpivAVbFbcbRTDsX96OEuyk7a1iZJVjQSXglpwNtH6n72dReGD0i'
        const res = await axios.post(`http://192.168.10.14:3001/api/unionbank/transfertransaction`, values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       if(res?.data?.success) return alert(res?.data?.message)
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
            </Box>
        </>
    );
}

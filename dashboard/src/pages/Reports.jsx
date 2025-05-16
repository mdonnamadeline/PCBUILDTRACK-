import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { styled } from "@mui/system";
import "../styles/Reports.css";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)({
    fontWeight: "bold",
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

export default function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "Admin") {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `${VITE_REACT_APP_API_HOST}/api/reports`
                );
                setTransactions(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError("Failed to fetch transactions");
                setTransactions([]);
            }
        };
        fetchTransactions();
    }, [VITE_REACT_APP_API_HOST]);

    useEffect(() => {
        let total = 0;
        let orderCount = transactions.length;
        let totalQuantitySum = 0;

        transactions.forEach((transaction) => {
            const itemPrice = parseFloat(transaction.price) || 0;
            const itemQuantity = parseInt(transaction.quantity, 10) || 1;
            total += itemPrice;
            totalQuantitySum += itemQuantity;
        });

        setTotalSales(total);
        localStorage.setItem("totalSales", total);
        localStorage.setItem("totalOrders", orderCount);
        localStorage.setItem("totalQuantity", totalQuantitySum);
    }, [transactions]);

    const handleClickOpen = (id) => {
        setSelectedTransactionId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(
                `${VITE_REACT_APP_API_HOST}/api/reports/${selectedTransactionId}`
            );
            if (res.data.success) {
                alert(res.data.message);
                setTransactions((prevTransactions) =>
                    prevTransactions.filter(
                        (transaction) =>
                            transaction._id !== selectedTransactionId
                    )
                );
                setOpen(false);
            } else {
                alert(res.data.error || "Failed to delete transaction");
            }
        } catch (error) {
            setError("Failed to delete transaction");
            alert("An error occurred while deleting the transaction.");
        }
    };

    return (
        <div className="manage-user">
            <Sidebar />
            <div className="content">
                <div className="viewuser">
                    <div className="vucon">
                        <h1>Customer Transactions</h1>
                        <Typography variant="h6" gutterBottom className="total-sales">
                            Total Sales: ₱{typeof totalSales === 'number' ? totalSales.toFixed(2) : '0.00'}
                        </Typography>
                        {error && (
                            <Typography color="error" className="error-message">{error}</Typography>
                        )}
                        <TableContainer component={Paper} className="table-container">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Customer ID</StyledTableCell>
                                        <StyledTableCell>Product Name</StyledTableCell>
                                        <StyledTableCell>Quantity</StyledTableCell>
                                        <StyledTableCell>Price</StyledTableCell>
                                        <StyledTableCell>Bank</StyledTableCell>
                                        <StyledTableCell>Date and Time</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction._id}>
                                            <TableCell>
                                                {transaction.customerId}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.productName || "Unknown Product"}
                                            </TableCell>
                                            <TableCell>
                                                <strong>{parseInt(transaction.quantity, 10) || 1}</strong>
                                            </TableCell>
                                            <TableCell>
                                                ₱{(parseFloat(transaction.price) || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>{transaction.bank}</TableCell>
                                            <TableCell>
                                                {formatDate(transaction.date)}
                                            </TableCell>
                                            <TableCell>
                                                <DeleteIcon
                                                    onClick={() => handleClickOpen(transaction._id)}
                                                    color="error"
                                                    className="delete-icon"
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="dialog-title">
                        {"Confirm Deletion"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="dialog-content-text">
                            Are you sure you want to delete this transaction record?
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="secondary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
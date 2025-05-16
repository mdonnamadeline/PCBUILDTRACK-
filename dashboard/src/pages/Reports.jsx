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
                setTransactions(
                    Array.isArray(response.data) ? response.data : []
                );
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
        <div className="manage-report">
            <Sidebar />
            <div className="content">
                <div className="view-report">
                    <div className="vrcon">
                        <h1>Customer Transactions</h1>
                        <Typography
                            variant="h6"
                            gutterBottom
                            className="total-sales"
                        >
                            Total Sales: ₱
                            {typeof totalSales === "number"
                                ? totalSales.toFixed(2)
                                : "0.00"}
                        </Typography>
                        {error && (
                            <Typography color="error" className="error-message">
                                {error}
                            </Typography>
                        )}
                        <TableContainer
                            component={Paper}
                            sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}
                        >
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Customer ID
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Product Name
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Quantity
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Price
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Bank
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Date and Time
                                        </TableCell>
                                        <TableCell
                                            variant="head"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background: "#fafafa",
                                                letterSpacing: "0.03em",
                                            }}
                                        >
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((transaction, idx) => (
                                        <TableRow
                                            key={transaction._id}
                                            sx={{
                                                backgroundColor:
                                                    idx % 2 === 0
                                                        ? "#f9f9f9"
                                                        : "white",
                                                "&:hover": {
                                                    backgroundColor: "#f1f7ff",
                                                },
                                            }}
                                        >
                                            <TableCell variant="body">
                                                {transaction.customerId}
                                            </TableCell>
                                            <TableCell variant="body">
                                                {transaction.productName ||
                                                    "Unknown Product"}
                                            </TableCell>
                                            <TableCell variant="body">
                                                <strong>
                                                    {parseInt(
                                                        transaction.quantity,
                                                        10
                                                    ) || 1}
                                                </strong>
                                            </TableCell>
                                            <TableCell variant="body">
                                                ₱
                                                {(
                                                    parseFloat(
                                                        transaction.price
                                                    ) || 0
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell variant="body">
                                                {transaction.bank}
                                            </TableCell>
                                            <TableCell variant="body">
                                                {formatDate(transaction.date)}
                                            </TableCell>
                                            <TableCell variant="body">
                                                <DeleteIcon
                                                    onClick={() =>
                                                        handleClickOpen(
                                                            transaction._id
                                                        )
                                                    }
                                                    color="error"
                                                    sx={{ cursor: "pointer" }}
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
                    <DialogTitle
                        id="alert-dialog-title"
                        className="dialog-title"
                    >
                        {"Confirm Deletion"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText
                            id="alert-dialog-description"
                            className="dialog-content-text"
                        >
                            Are you sure you want to delete this transaction
                            record? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="secondary"
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

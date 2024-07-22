import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { styled } from "@mui/system";
import "../styles/Reports.css";

const StyledTableCell = styled(TableCell)({
    fontWeight: "bold",
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};


export default function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `${VITE_REACT_APP_API_HOST}/api/reports`
                );
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Failed to fetch transactions");
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        let total = 0;
        transactions.forEach((transaction) => {
            total +=
                parseFloat(transaction.quantity) *
                parseFloat(transaction.price);
        });
        setTotalSales(total);
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
                alert(res.data.error);
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
            setError("Failed to delete transaction");
        }
    };

    return (
        <div>
            <Sidebar />

            <Container maxWidth="lg" className="container">
                <Typography variant="h4" component="h1" gutterBottom>
                    Customer Transactions
                </Typography>

                <Typography variant="h6" gutterBottom className="total-sales">
                    Total Sales: ₱{totalSales.toFixed(2)}
                </Typography>

                {error && (
                    <Typography className="error-message">{error}</Typography>
                )}

                <TableContainer component={Paper} className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Date and Time</StyledTableCell>
                                <StyledTableCell>Product Name</StyledTableCell>
                                <StyledTableCell>Quantity</StyledTableCell>
                                <StyledTableCell>Price</StyledTableCell>
                                <StyledTableCell>Bank</StyledTableCell>
                                <StyledTableCell>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>
                                        {formatDate(transaction.date)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.productName}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.quantity}
                                    </TableCell>
                                    <TableCell>
                                        ₱{transaction.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{transaction.bank}</TableCell>
                                    <TableCell>
                                        <DeleteIcon
                                            onClick={() =>
                                                handleClickOpen(transaction._id)
                                            }
                                            color="error"
                                            className="delete-icon"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Confirmation Dialog */}
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
                            Are you sure you want to delete this transaction?
                            This action cannot be undone.
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
            </Container>
        </div>
    );
}

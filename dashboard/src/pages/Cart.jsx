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
import Navbar from "./Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/Navbar.css";
import "../styles/Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0); // Keep this for Navbar display
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) { // Check for user and user._id
            navigate("/login");
            return;
        }

        const storedCartItems =
            JSON.parse(localStorage.getItem("cartItems")) || [];

        // Filter items specifically for the logged-in user using user._id
        const userCartItems = storedCartItems.filter((item) => item.userId === user._id); // FIX: Use user._id
        setCartItems(userCartItems);

        // Update count based only on the current user's items
        updateCartItemCount(userCartItems);

    }, [navigate]); // Only run on mount and when navigate changes

    // This useEffect updates the count whenever the user's cartItems state changes (e.g., after deletion)
    useEffect(() => {
        const count = cartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );
        setCartItemCount(count);
        // Note: We don't need to update localStorage count here,
        // as the primary source is cartItems state derived from localStorage initially.
        // The count is mainly for display in Navbar.
    }, [cartItems]);

    // Helper function to update count state
    const updateCartItemCount = (items) => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
        // No need to set localStorage count here, it's derived
    };

    const handleSelectItem = (item) => {
        // Use item.id for comparison as it's the product's unique ID
        const itemId = item.id;
        setSelectedItems((prevSelectedItems) => {
            const isSelected = prevSelectedItems.some(selected => selected.id === itemId);
            if (isSelected) {
                return prevSelectedItems.filter((i) => i.id !== itemId);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };

    const handleDeleteItem = (itemToDelete) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) return; // Safety check

        const itemIdToDelete = itemToDelete.id;

        // Update component state first for immediate UI feedback
        const updatedCartItemsState = cartItems.filter((i) => i.id !== itemIdToDelete);
        setCartItems(updatedCartItemsState);

        // Update selected items if the deleted item was selected
        setSelectedItems((prevSelected) => prevSelected.filter(i => i.id !== itemIdToDelete));

        // Update localStorage by filtering ALL stored items
        const allStoredCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const updatedLocalStorageItems = allStoredCartItems.filter(
            (item) => !(item.id === itemIdToDelete && item.userId === user._id) // Remove only the specific item for this user
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedLocalStorageItems));

        // Recalculate and update count based on the new state
        updateCartItemCount(updatedCartItemsState);
    };


    const handleProceedToPayment = () => {
        if (selectedItems.length > 0) {
            const totalAmount = getTotalAmount();
            navigate("/payment", {
                state: { cartItems: selectedItems, totalAmount },
            });
        } else {
            alert("Please select at least one item to proceed.");
        }
    };

    const getTotalAmount = () => {
        return selectedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Format date string for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch (e) {
            return 'Invalid Date';
        }
    };


    return (
        <>
            <Navbar cartItemCount={cartItemCount} />
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
                                    {cartItems.map((item) => ( // Use item.id as key
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.some( // Check based on item.id
                                                        (i) => i.id === item.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectItem(item)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {formatDate(item.addedDate)} {/* Format date */}
                                            </TableCell>
                                            <TableCell>
                                                ₱{(item.price * item.quantity).toFixed(2)} {/* Format total */}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() =>
                                                        handleDeleteItem(item)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" gutterBottom>
                                Total Amount (Selected): ₱{getTotalAmount().toFixed(2)} {/* Format total */}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleProceedToPayment}
                                className="proceed-to-payment-button"
                                disabled={selectedItems.length === 0} // Disable if nothing selected
                            >
                                Proceed to Payment
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Your cart is empty.
                    </Typography>
                )}
            </div>
        </>
    );
}
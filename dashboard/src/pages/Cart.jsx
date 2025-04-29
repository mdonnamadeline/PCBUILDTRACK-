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
    TextField, // Import TextField for quantity display (optional)
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon
import RemoveIcon from "@mui/icons-material/Remove"; // Import Remove icon
import "../styles/Navbar.css";
import "../styles/Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigate = useNavigate();

    // --- Existing useEffect hooks ---
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
            navigate("/login");
            return;
        }
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const userCartItems = storedCartItems.filter((item) => item.userId === user._id);
        setCartItems(userCartItems);
        updateCartItemCount(userCartItems);
    }, [navigate]);

    useEffect(() => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
    }, [cartItems]);

    // --- Existing helper functions ---
    const updateCartItemCount = (items) => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
    };

    const handleSelectItem = (item) => {
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

    // --- Modified handleDeleteItem ---
    const handleDeleteItem = (itemToDelete) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) return;
        const itemIdToDelete = itemToDelete.id;

        // Update state
        const updatedCartItemsState = cartItems.filter((i) => i.id !== itemIdToDelete);
        setCartItems(updatedCartItemsState);

        // Update selected items
        setSelectedItems((prevSelected) => prevSelected.filter(i => i.id !== itemIdToDelete));

        // Update localStorage
        const allStoredCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const updatedLocalStorageItems = allStoredCartItems.filter(
            (item) => !(item.id === itemIdToDelete && item.userId === user._id)
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedLocalStorageItems));

        // Count update happens via useEffect watching cartItems
    };

    const handleQuantityChange = (itemToUpdate, operation) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) return;

        let newQuantity;
        const maxStockAvailable = itemToUpdate.maxStock; // Get max stock from the item data

        if (operation === '+') {
            newQuantity = itemToUpdate.quantity + 1;
            // Check against the stored max stock
            if (newQuantity > maxStockAvailable) {
                alert(`Cannot add more. Only ${maxStockAvailable} items available in stock.`);
                return; // Stop the function if stock limit is reached
            }
        } else { // operation === '-'
            newQuantity = itemToUpdate.quantity - 1;
        }

        // Prevent quantity from going below 1
        if (newQuantity < 1) {
            return;
        }

        // Update state
        const updatedCartItemsState = cartItems.map(item =>
            item.id === itemToUpdate.id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItemsState);

        // Update selected items state if the changed item is selected
        setSelectedItems(prevSelected =>
            prevSelected.map(item =>
                item.id === itemToUpdate.id ? { ...item, quantity: newQuantity } : item
            )
        );

        // Update localStorage
        const allStoredCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const updatedLocalStorageItems = allStoredCartItems.map(item =>
            (item.id === itemToUpdate.id && item.userId === user._id)
                ? { ...item, quantity: newQuantity } // Keep other properties like maxStock
                : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedLocalStorageItems));

        // Count update happens via useEffect watching cartItems
    };


    // --- Existing proceed/total functions ---
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
                                        <TableCell align="center">Quantity</TableCell> {/* Align center */}
                                        <TableCell>Price</TableCell>
                                        <TableCell>Date Added</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.some(
                                                        (i) => i.id === item.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectItem(item)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            {/* --- Quantity Cell Updated --- */}
                                            <TableCell align="center">
                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item, '-')}
                                                        disabled={item.quantity <= 1} // Disable if quantity is 1
                                                    >
                                                        <RemoveIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <Typography sx={{ marginX: 1.5 }}> {/* Add margin */}
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item, '+')}
                                                        // Add disabled logic here if you have max stock info
                                                    >
                                                        <AddIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            {/* --- End Quantity Cell Update --- */}
                                            <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {formatDate(item.addedDate)}
                                            </TableCell>
                                            <TableCell>
                                                ₱{(item.price * item.quantity).toFixed(2)}
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
                                Total Amount (Selected): ₱{getTotalAmount().toFixed(2)}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleProceedToPayment}
                                className="proceed-to-payment-button"
                                disabled={selectedItems.length === 0}
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
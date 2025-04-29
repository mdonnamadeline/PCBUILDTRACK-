import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    Modal,
    Box,
    TextField,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Navbar from "./Navbar";
import "../styles/Menu.css";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 15,
    p: 2,
};

export default function Menu() {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [dataList, setDataList] = useState([]);
    const [user, setUser] = useState(null);
    const [openAddToOrder, setOpenAddToOrder] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // New state for category filter
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0); // State for cart count

    const categories = [
        "Processor",
        "GPU",
        "Motherboard",
        "RAM",
        "Monitor",
        "Case",
        "Laptop",
        "Storage",
    ];

    useEffect(() => {
        fetchData();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        // Load cart count from localStorage
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const userCartItems = storedUser
            ? cartItems.filter((item) => item.userId === storedUser._id) // Changed storedUser.id to storedUser._id
            : [];
        const count = userCartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );
        setCartCount(count);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/api/menu`
            );
            setDataList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCloseAddToOrder = () => {
        setOpenAddToOrder(false); // Close the modal
        setSelectedProduct(null); // Clear the selected product
    };
    // ...existing code...
    const handleAddToCart = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
            return;
        }

        // Check if requested quantity exceeds available stock
        if (quantity > selectedProduct.quantity) {
            alert(
                `Not enough stock available. Only ${selectedProduct.quantity} items left.`
            );
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItemIndex = cartItems.findIndex(
            (item) =>
                item.id === selectedProduct._id && item.userId === user._id
        );

        if (existingItemIndex !== -1) {
            const currentCartQuantity = cartItems[existingItemIndex].quantity;
            const maxStock =
                cartItems[existingItemIndex].maxStock ||
                selectedProduct.quantity;
            const newTotalQuantity = currentCartQuantity + quantity;

            if (newTotalQuantity > maxStock) {
                alert(
                    `Cannot add ${quantity} more. You already have ${currentCartQuantity} in cart and only ${maxStock} are available in total.`
                );
                return;
            }
            cartItems[existingItemIndex].quantity = newTotalQuantity;
            if (!cartItems[existingItemIndex].maxStock) {
                cartItems[existingItemIndex].maxStock =
                    selectedProduct.quantity;
            }
        } else {
            cartItems.push({
                id: selectedProduct._id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                addedDate: new Date().toISOString(),
                userId: user._id,
                maxStock: selectedProduct.quantity,
            });
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Update cart count state for the Navbar
        const userCartItems = cartItems.filter(
            (item) => item.userId === user._id
        );
        const newCartCount = userCartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );
        setCartCount(newCartCount);

        setOpenAddToOrder(false); // Close the modal
        alert("Item added to cart successfully!"); // Add success alert
    };

    // ... (rest of the component code remains the same) ...

    const handleOpenAddToOrder = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity to 1 when opening the modal
        setOpenAddToOrder(true);
    };

    const handleQuantityChange = (operation) => {
        if (operation === "+" && quantity >= selectedProduct.quantity) {
            alert(
                `Cannot add more. Only ${selectedProduct.quantity} items available in stock.`
            );
            return;
        }

        setQuantity((prevQuantity) =>
            operation === "+" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
        );
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
    };

    const filteredMenuItems = dataList.filter((menu) => {
        // Add this condition to check if the item is NOT disabled
        const isNotDisabled = !menu.disabled;

        const matchesSearch = `${menu.name} ${menu.description} ${menu.price}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            !selectedCategory || menu.category === selectedCategory;

        // Include the isNotDisabled check in the return statement
        return isNotDisabled && matchesSearch && matchesCategory;
    });

    return (
        <div className="menu">
            <Navbar cartItemCount={cartCount} />
            <div className="menu-header">
                <div className="categories-navbar">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={
                                selectedCategory === category
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => handleCategoryClick(category)}
                            className="category-button"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="searchBar"
                />
            </div>
            <div className="menu-main">
                <div className="menu-list">
                    {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((menu) => (
                            <ProductCard
                                key={menu._id}
                                menu={menu}
                                handleOpen={handleOpenAddToOrder}
                            />
                        ))
                    ) : (
                        <p>No menu items available.</p>
                    )}
                </div>
            </div>
            {/* Modal for Add to Order */}
            <Modal
                open={openAddToOrder}
                onClose={handleCloseAddToOrder} // Use the defined function here
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    {selectedProduct && (
                        <>
                            <Typography
                                id="modal-title"
                                variant="h6"
                                component="h2"
                            >
                                {selectedProduct.name}
                            </Typography>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`${VITE_REACT_APP_API_HOST}/uploads/${selectedProduct.image}`}
                                alt={selectedProduct.name}
                                sx={{ mt: 2, mb: 2, objectFit: "contain" }}
                            />
                            <Typography id="modal-description" sx={{ mt: 2 }}>
                                {selectedProduct.description}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                ₱{selectedProduct.price} x {quantity} = ₱
                                {selectedProduct.price * quantity}
                            </Typography>
                            <div
                                className="quantity-control"
                                style={{ marginTop: "16px" }}
                            >
                                <IconButton
                                    onClick={() => handleQuantityChange("-")}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <TextField
                                    value={quantity}
                                    inputProps={{
                                        readOnly: true,
                                        style: { textAlign: "center" },
                                    }}
                                    sx={{ width: "60px", mx: 2 }}
                                />
                                <IconButton
                                    onClick={() => handleQuantityChange("+")}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <Button
                                variant="contained"
                                onClick={handleAddToCart}
                                sx={{
                                    mt: 2,
                                    backgroundColor: "rgb(161,27,27)",
                                    "&:hover": {
                                        backgroundColor: "rgb(41, 122, 51)",
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

function ProductCard({ menu, handleOpen }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${menu.image}`;

    return (
        <Card className="product-card">
            <CardHeader
                title={
                    <div style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
                        {menu.name}
                    </div>
                }
                subheader={`₱${menu.price}`}
            />
            <CardMedia
                component="img"
                height="100"
                image={imageUrl}
                alt={menu.name}
            />
            <CardContent>
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    style={{ fontSize: "12px" }}
                >
                    {menu.description}
                </Typography>
                {menu.quantity <= 0 ? (
                    <Button
                        variant="contained"
                        disabled
                        sx={{
                            marginTop: "10px",
                            width: "100%",
                            backgroundColor: "#d3d3d3",
                            color: "#666",
                            "&.Mui-disabled": {
                                backgroundColor: "#d3d3d3",
                                color: "#666",
                            },
                        }}
                    >
                        Not Available
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            color: "white",
                            backgroundColor: "#b893fd",
                        }}
                        onClick={() => handleOpen(menu)}
                    >
                        Add to Order
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

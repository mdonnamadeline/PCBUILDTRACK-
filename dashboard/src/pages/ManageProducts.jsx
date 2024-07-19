import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageProducts.css";
import Sidebar from "./Sidebar";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ManageProducts() {
    const initialData = {
        name: "",
        description: "",
        image: "",
        price: "",
        disabled: false,
        quantity: "",
    };

    const [currentData, setCurrentData] = useState(initialData);
    const [dataList, setDataList] = useState([]);
    const [refreshDataList, setRefreshDataList] = useState(false);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [modalState, setModalState] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const navigate = useNavigate();

    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        fetchData();
    }, [refreshDataList]);

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${VITE_REACT_APP_API_HOST}/api/menu`
            );
            if (response.data && Array.isArray(response.data.data)) {
                setDataList(response.data.data);
            } else {
                console.error("Unexpected response data:", response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAddData = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(currentData).forEach((key) => {
            formData.append(key, currentData[key]);
        });

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/menu`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
                setImageUrl("");
            } else {
                alert("Failed to add menu. Please try again!");
            }
        } catch (error) {
            console.error("Error adding menu:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleUpdateData = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(currentData).forEach((key) => {
            formData.append(key, currentData[key]);
        });

        try {
            const response = await axios.put(
                `${VITE_REACT_APP_API_HOST}/api/menu/${currentData._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
                setImageUrl("");
            } else {
                alert("Failed to update menu. Please try again!");
            }
        } catch (error) {
            console.error("Error updating menu:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleDeleteData = async (data) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `${VITE_REACT_APP_API_HOST}/api/menu/${data._id}`
            );

            const result = response.data;
            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
            } else {
                alert("Failed to delete menu. Please try again!");
            }
        } catch (error) {
            console.error("Error deleting menu:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const openModal = (dataTile = initialData, isEdit = false) => {
        setCurrentData(dataTile);
        setImageUrl(
            dataTile.image
                ? `${VITE_REACT_APP_API_HOST}/uploads/${dataTile.image}`
                : ""
        );
        setIsEditMode(isEdit);
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
        setImageUrl("");
    };

    const handleChange = (e) => {
        setCurrentData({
            ...currentData,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentData({
            ...currentData,
            [name]: value,
        });
    };

    const handleSwitch = (e) => {
        setCurrentData({
            ...currentData,
            [e.target.name]: e.target.checked,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCurrentData({
                ...currentData,
                image: e.target.files[0],
            });
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleFilterSearchChange = (event) => {
        setFilterSearch(event.target.value);
    };

    const filteredDataList = dataList.filter((data) => {
        if (!search) return true;
        if (!filterSearch) {
            return (
                (data.name &&
                    data.name.toLowerCase().includes(search.toLowerCase())) ||
                (data.description &&
                    data.description
                        .toLowerCase()
                        .includes(search.toLowerCase())) ||
                (data.price &&
                    String(data.price)
                        .toLowerCase()
                        .includes(search.toLowerCase())) ||
                (data.disabled !== undefined &&
                    (data.disabled ? "yes" : "no").includes(
                        search.toLowerCase()
                    ))
            );
        }
        if (filterSearch === "Name")
            return (
                data.name &&
                data.name.toLowerCase().includes(search.toLowerCase())
            );
        if (filterSearch === "Description")
            return (
                data.description &&
                data.description.toLowerCase().includes(search.toLowerCase())
            );
        if (filterSearch === "Price")
            return (
                data.price &&
                String(data.price).toLowerCase().includes(search.toLowerCase())
            );
        if (filterSearch === "Disabled")
            return (
                data.disabled !== undefined &&
                (data.disabled ? "yes" : "no").includes(search.toLowerCase())
            );
        return false;
    });

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Product </h1>

                <div className="column-gap">
                    <div className="search-filter">
                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Filter</InputLabel>
                            <Select
                                value={filterSearch}
                                label="Filter"
                                onChange={handleFilterSearchChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"Name"}>Name</MenuItem>
                                <MenuItem value={"Description"}>
                                    Description
                                </MenuItem>
                                <MenuItem value={"Price"}>Price</MenuItem>
                                <MenuItem value={"Disabled"}>Disabled</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            variant="outlined"
                            id="search"
                            label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                    </div>

                    <Button
                        className="tablebutton"
                        variant="contained"
                        onClick={() => openModal(initialData, false)}
                        style={{ backgroundColor: "#aa0f0f" }}
                    >
                        ADD PRODUCT
                    </Button>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Stocks</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Disabled</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredDataList.map((data) => (
                                <TableRow key={data._id}>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.description}</TableCell>
                                    <TableCell>{data.image}</TableCell>
                                    <TableCell>{data.quantity}</TableCell>
                                    <TableCell>{data.price}</TableCell>
                                    <TableCell>
                                        {data.disabled ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="buttongroup">
                                            <IconButton
                                                onClick={() =>
                                                    openModal(data, true)
                                                }
                                            >
                                                <Edit className="actionicon" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDeleteData(data)
                                                }
                                            >
                                                <Delete className="actionicon" />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={modalState} onClose={closeModal}>
                    <Box className="modal">
                        <form
                            className="modalform"
                            onSubmit={
                                isEditMode ? handleUpdateData : handleAddData
                            }
                        >
                            {imageUrl ? (
                                <div className="image-container">
                                    <img
                                        src={imageUrl}
                                        alt="Current"
                                        style={{
                                            width: "300px",
                                            height: "194px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ) : typeof currentData.image === "string" &&
                              currentData.image !== "" ? (
                                <div className="image-container">
                                    <img
                                        src={`${VITE_REACT_APP_API_HOST}/uploads/${currentData.image}`}
                                        alt="Current"
                                        style={{
                                            width: "300px",
                                            height: "194px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="image-container">
                                    <div
                                        style={{
                                            width: "300px",
                                            height: "194px",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        No image yet
                                    </div>
                                </div>
                            )}

                            <TextField
                                variant="outlined"
                                id="name"
                                required
                                label="Name"
                                value={currentData.name}
                                onChange={handleChange}
                                disabled={isEditMode}
                            />

                            <TextField
                                variant="outlined"
                                id="description"
                                required
                                label="Description"
                                value={currentData.description}
                                onChange={handleChange}
                            />

                            <TextField
                                variant="outlined"
                                id="image"
                                required={!isEditMode}
                                type="file"
                                label={
                                    isEditMode ? "Update Image" : "Add Image"
                                }
                                onChange={handleImageChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={currentData.quantity || ""} 
                                onChange={handleInputChange}
                            />

                            <TextField
                                variant="outlined"
                                id="price"
                                required
                                type="number"
                                label="Price"
                                value={currentData.price}
                                onChange={handleChange}
                                inputProps={{ className: "hide-arrows" }}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentData.disabled}
                                        onChange={handleSwitch}
                                        name="disabled"
                                        inputProps={{
                                            "aria-label": "Disabled toggle",
                                        }}
                                    />
                                }
                                label="Disabled"
                            />

                            <Button
                                className="tablebutton"
                                variant="contained"
                                type="submit"
                            >
                                {isEditMode ? "UPDATE" : "ADD"}
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

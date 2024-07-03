import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Modal,
    Box,
    Table,
    TableContainer,
    TextField,
    Switch,
    Input,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import Navbar from "./Navbar";
import { Delete, Edit } from "@mui/icons-material";
import "./ManageProducts.css";

export default function ManageProducts() {
    const initialData = {
        name: "",
        description: "",
        image: "",
        price: "",
        disabled: false,
    };

    const [dataList, setDataList] = useState([]);
    const [refreshDataList, setRefreshDataList] = useState(false);
    const [currentData, setCurrentData] = useState(initialData);
    const [modalState, setModalState] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        fetchData();
    }, [refreshDataList]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${VITE_REACT_APP_API_HOST}/viewmenu`);
            setDataList(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setDataList([]); 
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentData({
            ...currentData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSwitch = (e) => {
        setCurrentData({
            ...currentData,
            disabled: e.target.checked,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const openModal = (data = initialData, isEdit = false) => {
        setCurrentData(data);
        setFile(null);
        setIsEditMode(isEdit);
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
        setImageUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!VITE_REACT_APP_API_HOST) {
            alert("API host is not defined. Please check your environment variables.");
            return;
        }
    
        const formData = new FormData();
        formData.append("name", currentData.name);
        formData.append("description", currentData.description);
        formData.append("price", currentData.price);
        formData.append("disabled", currentData.disabled);
        if (file) formData.append("image", file);
    
        try {
            let response;
            if (isEditMode) {
                response = await axios.put(
                    `${VITE_REACT_APP_API_HOST}/updatemenu/${currentData._id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                response = await axios.post(
                    `${VITE_REACT_APP_API_HOST}/addmenu`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }
    
            const result = response.data;
            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
            } else {
                alert(result.message || "Failed to submit data. Please try again!");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert(`An error occurred. Please try again. Error: ${error.message}`);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${VITE_REACT_APP_API_HOST}/deletemenu/${id}`
            );
            const result = response.data;
            if (result.status === "ok") {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
            } else {
                alert(result.message || "Failed to delete data. Please try again!");
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="container">
            <Navbar />
            <div className="content">
                <h1>Manage Products</h1>
                <Button
                    className="manage-button"
                    variant="contained"
                    onClick={() => openModal(initialData, false)}
                >
                    ADD PRODUCT
                </Button>

                <TableContainer className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Image</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Disabled</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">{item.description}</TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={`${VITE_REACT_APP_API_HOST}/images/${item._id}.jpg`}
                                            alt={item.name}
                                            style={{ width: "50px" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">₱ {item.price}</TableCell>
                                    <TableCell align="center">
                                        {item.disabled ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => openModal(item, true)}>
                                            <Edit className="icon-edit" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(item._id)}>
                                            <Delete className="icon-delete" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={modalState} onClose={closeModal}>
                    <Box className="modal">
                        <form onSubmit={handleSubmit}>
                            <p>{isEditMode ? "EDIT" : "ADD NEW PRODUCT"}</p>
                            {imageUrl && (
                                <div className="image-container">
                                    <img
                                        src={imageUrl}
                                        alt="Current"
                                        style={{ width: "300px", height: "194px", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                            {!isEditMode && (
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    fullWidth
                                    margin="none"
                                />
                            )}
                            <TextField
                                id="name"
                                required
                                label="Name"
                                variant="outlined"
                                name="name"
                                value={currentData.name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="description"
                                required
                                label="Description"
                                variant="outlined"
                                name="description"
                                value={currentData.description}
                                onChange={handleChange}
                                multiline
                                rows="4"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="price"
                                required
                                label="Price"
                                variant="outlined"
                                name="price"
                                type="number"
                                value={currentData.price}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentData.disabled || false}
                                        onChange={handleSwitch}
                                        name="disabled"
                                        inputProps={{ "aria-label": "Disabled toggle" }}
                                    />
                                }
                                label="Disabled"
                            />
                            <Button
                                className="buttonmodal"
                                variant="contained"
                                type="submit"
                            >
                                {isEditMode ? "EDIT" : "ADD"}
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

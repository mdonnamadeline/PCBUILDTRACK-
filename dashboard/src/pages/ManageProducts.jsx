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
} from "@mui/material";
import Navbar from "./Navbar";
import "./ManageProducts.css";
import { Delete, Edit } from "@mui/icons-material";

export default function ManageProducts() {
    const [dataList, setDataList] = useState([]);
    const [refreshDataList, setRefreshDataList] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const initialData = {
        name: "",
        description: "",
        image: "",
        price: "",
        disabled: false,
    };

    const [currentData, setCurrentData] = useState(initialData);
    const [file, setFile] = useState(null);

    const openModal = (data = initialData, isEdit = false) => {
        setCurrentData(data);
        setFile(null);
        setIsEditMode(isEdit);
        setModalState(true);
    };

    const closeModal = () => {
        setModalState(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentData({
            ...currentData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Inside your component
    useEffect(() => {
        console.log("Updated disabled state:", currentData.disabled);
    }, [currentData.disabled]);

    const handleSwitch = (event) => {
        setCurrentData({
            ...currentData,
            disabled: event.target.checked,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/get-menu`)
            .then((response) => {
                setDataList(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [refreshDataList]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", currentData.name);
        formData.append("description", currentData.description);
        formData.append("price", currentData.price);
        formData.append("disabled", currentData.disabled); // Ensure disabled status is included in formData
        if (file) formData.append("file", file);

        try {
            let response;

            if (isEditMode) {
                response = await axios.put(
                    `${VITE_REACT_APP_API_HOST}/update-menu/${currentData._id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                response = await axios.post(
                    `${VITE_REACT_APP_API_HOST}/upload-menu`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            const result = response.data;

            if (result.status === "ok" || result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
            } else {
                alert(
                    result.message || "Failed to submit data. Please try again!"
                );
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${VITE_REACT_APP_API_HOST}/delete-menu/${id}`
            );
            const result = response.data;

            if (result.status === "ok") {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
            } else {
                alert(
                    result.message || "Failed to delete data. Please try again!"
                );
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
                    onClick={() => openModal(initialData, false)} // Open add modal
                >
                    ADD ENTRY
                </Button>

                <TableContainer className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                    Description
                                </TableCell>
                                <TableCell align="center">Image</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Disabled</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell align="center">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.description}
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={`${VITE_REACT_APP_API_HOST}/images/${item._id}.jpg`} // Change based on how you serve images
                                            alt={item.name}
                                            style={{ width: "50px" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        ₱ {item.price}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.disabled ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Edit
                                            className="icon-edit"
                                            onClick={() =>
                                                openModal(item, true)
                                            }
                                        />
                                        <Delete
                                            className="icon-delete"
                                            onClick={() =>
                                                handleDelete(item._id)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={modalState} onClose={closeModal}>
                    <Box className="modal">
                        <form onSubmit={handleSubmit}>
                            <p>{isEditMode ? "EDIT" : "ADD NEW ENTRY"}</p>

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
                                        checked={currentData.disabled || false} // Ensure the disabled state is correct
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

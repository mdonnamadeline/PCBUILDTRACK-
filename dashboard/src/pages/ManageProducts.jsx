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
    };

    const [currentData, setCurrentData] = useState(initialData);

    const openModal = (data = initialData, isEdit = false) => {
        setCurrentData(data);
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
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/get-products`)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [refreshDataList]);

    const handleAddEntry = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/add-product`,
                currentData
            );

            const result = await response.data;

            if (result.success) {
                setRefreshDataList(!refreshDataList);
                setModalState(false);
            }
            alert(result.message);
        } catch (error) {
            console.error("Error adding data:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleEditEntry = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/edit-product`,
                currentData
            );

            const result = response.data;

            if (result.success) {
                alert(result.message);
                setRefreshDataList(!refreshDataList);
                setModalState(false);
            } else {
                alert("Failed to update data. Please try again!.");
            }
        } catch (error) {
            console.error("Error updating data:", error);
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
                    ADD ENTRY
                </Button>

                <TableContainer className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Image</TableCell>
                                <TableCell align="center">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">{item.description}</TableCell>
                                    <TableCell align="center">
                                        <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} style={{ width: "50px" }} />
                                    </TableCell>
                                    <TableCell align="center">₱ {item.price}</TableCell>
                                    <TableCell align="center">
                                        <Switch checked={item.disabled} disabled />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Edit
                                            className="icon-edit"
                                            onClick={() => openModal(item, true)}
                                        />
                                        <Delete className="icon-delete" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={modalState} onClose={closeModal}>
                    <Box className="modal">
                        {currentData && (
                            <form
                                onSubmit={isEditMode ? handleEditEntry : handleAddEntry}
                            >
                                <p>{isEditMode ? "EDIT" : "ADD NEW ENTRY"}</p>

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
                                    id="image"
                                    required
                                    label="Image (Base64)"
                                    variant="outlined"
                                    name="image"
                                    value={currentData.image}
                                    onChange={handleChange}
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

                                <div className="switch-container">
                                    <label>Disabled</label>
                                    <Switch
                                        checked={currentData.disabled}
                                        onChange={handleChange}
                                        name="disabled"
                                    />
                                </div>

                                <Button
                                    className="buttonmodal"
                                    variant="contained"
                                    type="submit"
                                >
                                    {isEditMode ? "EDIT" : "ADD"}
                                </Button>
                            </form>
                        )}
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

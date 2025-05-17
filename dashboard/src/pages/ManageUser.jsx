import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import axios from "axios";
import { Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/ManageUser.css";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 2,
    borderRadius: "10px",
    width: "100%",
    minWidth: 800,
};

// Modify the delete modal style
const deleteModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 2,
    borderRadius: "10px",
    width: "400px", // Smaller width for delete modal
    p: 4, // Add padding
};

export default function ManageUser() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const initialUserState = {
        firstname: "",
        lastname: "",
        middlename: "",
        email: "",
        password: "",
        role: "",
    };

    function handleOpen(user, edit) {
        setOpen(true);
        setIsEditMode(edit);
        setCurrentUser(edit ? user : initialUserState);
    }

    function handleClose() {
        setOpen(false);
        setCurrentUser(null);
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/users`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [refreshData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        `${user.firstname} ${user.lastname} ${user.middlename} ${user.email} ${user.role}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        // Only validate password if it's being changed
        if (currentUser.password && currentUser.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        try {
            // The encryption will happen on the backend
            const response = await axios.put(
                `${VITE_REACT_APP_API_HOST}/api/users/${currentUser._id}`,
                currentUser
            );

            const result = response.data;

            if (result.success) {
                alert(result.message);
                setRefreshData(!refreshData);
                setOpen(false);
            } else {
                alert(result.message || "Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleDeleteDialogOpen = (userId) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setUserToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            await axios.delete(
                `${VITE_REACT_APP_API_HOST}/api/users/${userToDelete}`
            );
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== userToDelete)
            );
            handleDeleteDialogClose();
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user. Please try again.");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Basic password validation
        if (currentUser.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        try {
            // The encryption will happen on the backend
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users`,
                currentUser
            );

            const result = await response.data;

            if (result.success) {
                setRefreshData(!refreshData);
                setOpen(false);
                alert(result.message);
            } else {
                alert(result.message || "Failed to add user");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="manage-user">
            <Sidebar />
            <div className="content">
                <div className="view-user">
                    <div className="vucon">
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "600",
                                margin: "0 0 20px 0",
                                fontFamily: "Poppins, sans-serif",
                                color: "#000",
                            }}
                        >
                            Manage User
                        </h1>
                        <div className="addbutton">
                            <Button
                                variant="contained"
                                onClick={() => handleOpen(null, false)}
                                style={{
                                    backgroundColor: "#b893fd", // Updated button color
                                    color: "white", // Ensure text is readable
                                }}
                            >
                                ADD USER
                            </Button>
                            <br />
                        </div>
                        <div className="search">
                            <TextField
                                label="Search Users"
                                variant="outlined"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <TableContainer className="user-table-container">
                            <Table stickyHeader className="user-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="user-table-header">
                                            First Name
                                        </TableCell>
                                        <TableCell className="user-table-header">
                                            Last Name
                                        </TableCell>
                                        <TableCell className="user-table-header">
                                            Middle Name
                                        </TableCell>
                                        <TableCell className="user-table-header">
                                            Email
                                        </TableCell>
                                        <TableCell className="user-table-header">
                                            Role
                                        </TableCell>
                                        <TableCell
                                            className="user-table-header"
                                            align="center"
                                        >
                                            Edit
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.map((user, idx) => (
                                        <TableRow
                                            key={user.email}
                                            className={
                                                idx % 2 === 0
                                                    ? "user-table-row-even"
                                                    : "user-table-row-odd"
                                            }
                                        >
                                            <TableCell>
                                                {user.firstname}
                                            </TableCell>
                                            <TableCell>
                                                {user.lastname}
                                            </TableCell>
                                            <TableCell>
                                                {user.middlename}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleOpen(user, true)
                                                    }
                                                    className="edit-btn"
                                                >
                                                    EDIT
                                                </Button>
                                                <IconButton
                                                    onClick={() =>
                                                        handleDeleteDialogOpen(
                                                            user._id
                                                        )
                                                    }
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Modal open={open} onClose={handleClose}>
                            <Box sx={style} className="box">
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                >
                                    User Information
                                </Typography>
                                <form
                                    className="editModalText"
                                    onSubmit={
                                        isEditMode
                                            ? handleUpdateUser
                                            : handleAddUser
                                    }
                                >
                                    <TextField
                                        required
                                        id="firstname"
                                        name="firstname"
                                        label="First Name"
                                        variant="outlined"
                                        value={currentUser?.firstname || ""}
                                        onChange={handleChange}
                                        inputProps={{ pattern: "^[A-Za-z ]+$" }}
                                    />
                                    <TextField
                                        required
                                        id="lastname"
                                        name="lastname"
                                        label="Last Name"
                                        variant="outlined"
                                        value={currentUser?.lastname || ""}
                                        onChange={handleChange}
                                        inputProps={{ pattern: "^[A-Za-z ]+$" }}
                                    />
                                    <TextField
                                        id="middlename"
                                        name="middlename"
                                        label="Middle Name"
                                        variant="outlined"
                                        value={currentUser?.middlename || ""}
                                        onChange={handleChange}
                                        inputProps={{ pattern: "^[A-Za-z ]+$" }}
                                    />
                                    <TextField
                                        required
                                        name="email"
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        value={currentUser?.email || ""}
                                        onChange={handleChange}
                                        inputProps={{
                                            pattern:
                                                "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
                                        }}
                                    />
                                    <TextField
                                        required
                                        name="password"
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={currentUser?.password || ""}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <FormControl required variant="outlined">
                                        <InputLabel htmlFor="role">
                                            Role
                                        </InputLabel>
                                        <Select
                                            label="Role"
                                            name="role"
                                            id="role"
                                            value={currentUser?.role || ""}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Admin">
                                                Admin
                                            </MenuItem>
                                            <MenuItem value="Owner">
                                                Owner
                                            </MenuItem>
                                            <MenuItem value="Customer">
                                                Customer
                                            </MenuItem>{" "}
                                            {/* Fixed typo: Costumer → Customer */}
                                            <MenuItem value="Staff">
                                                Staff
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Box mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            style={{
                                                backgroundColor: "#b893fd", // Updated button color
                                                color: "white", // Ensure text is readable
                                            }}
                                        >
                                            {isEditMode ? "Update" : "Add"}
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Modal>

                        <Modal
                            open={deleteDialogOpen}
                            onClose={handleDeleteDialogClose}
                        >
                            <Box sx={deleteModalStyle}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                    align="center" // Center the title
                                >
                                    Confirm Delete
                                </Typography>
                                <Typography
                                    sx={{ mt: 2, mb: 3 }}
                                    align="center"
                                >
                                    Are you sure you want to delete this user?
                                </Typography>
                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="center" // Center the buttons
                                    gap={2} // Add space between buttons
                                >
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteUser}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleDeleteDialogClose}
                                        sx={{ bgcolor: "grey.500" }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

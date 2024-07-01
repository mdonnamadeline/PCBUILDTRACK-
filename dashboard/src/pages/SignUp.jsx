import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";
const { VITE_REACT_APP_API_HOST } = import.meta.env;

export default function SignUp() {
    // LOGIC
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        middlename: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("Customer object:", user); // Log customer object
        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/signup`,
                user
            );
            const result = response.data;

            if (result.success) {
                navigate("/");
            }
            alert(result.message);
        } catch (error) {
            console.error("Error signing up customer:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // DISPLAY
    return (
        <div className="SignUpContainer">
            <div className="SignUpMain">
                <form className="signupForm" onSubmit={handleSignup}>
                    <h6>PLEASE SIGN UP</h6>
                    <TextField
                        required
                        id="firstname"
                        label="First Name"
                        variant="outlined"
                        value={user.firstname}
                        onChange={handleChange}
                        inputProps={{
                            pattern: "^[A-Za-z ]+$",
                            title: "Only letters and spaces are allowed.",
                        }}
                    />

                    <TextField
                        required
                        id="lastname"
                        label="Last Name"
                        variant="outlined"
                        value={user.lastname}
                        onChange={handleChange}
                        inputProps={{
                            pattern: "^[A-Za-z ]+$",
                            title: "Only letters and spaces are allowed.",
                        }}
                    />

                    <TextField
                        id="middlename"
                        label="Middle Name"
                        variant="outlined"
                        value={user.middlename}
                        onChange={handleChange}
                        inputProps={{
                            pattern: "^[A-Za-z ]+$",
                            title: "Only letters and spaces are allowed.",
                        }}
                    />

                    <TextField
                        required
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={user.email}
                        onChange={handleChange}
                        inputProps={{
                            pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                        }}
                    />
                    <TextField
                        id="password"
                        required
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        value={user.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="btnGroup">
                        <Button variant="contained" type="submit">
                            SignUp
                        </Button>
                        <Button variant="contained" onClick={handleBack}>
                            Back
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

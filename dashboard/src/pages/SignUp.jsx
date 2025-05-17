import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";

const { VITE_REACT_APP_API_HOST } = import.meta.env;

export default function SignUp() {
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
        navigate("/login");
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Basic password validation
        if (user.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users/signup`,
                user
            );
            const result = response.data;

            if (result.success) {
                alert("Signup successful!");
                setUser({
                    firstname: "",
                    lastname: "",
                    middlename: "",
                    email: "",
                    password: "",
                });
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error signing up customer:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="SignUpContainer">
            <div className="SignUpMain">
                <div className="signupFormContainer">
                    <form className="signupForm" onSubmit={handleSignup}>
                        <h6>PCBUILD TRACK</h6>

                        {/* First Name & Last Name in one row */}
                        <div className="inputRow">
                            <TextField
                                required
                                id="firstname"
                                label="First Name"
                                variant="filled"
                                value={user.firstname}
                                onChange={handleChange}
                                inputProps={{
                                    pattern: "^[A-Za-z ]+$",
                                    title: "Only letters and spaces are allowed.",
                                }}
                                fullWidth
                            />
                            <TextField
                                required
                                id="lastname"
                                label="Last Name"
                                variant="filled"
                                value={user.lastname}
                                onChange={handleChange}
                                inputProps={{
                                    pattern: "^[A-Za-z ]+$",
                                    title: "Only letters and spaces are allowed.",
                                }}
                                fullWidth
                            />
                        </div>

                        {/* Middle Name & Email in one row */}
                        <div className="inputRow">
                            <TextField
                                id="middlename"
                                label="Middle Name"
                                variant="filled"
                                value={user.middlename}
                                onChange={handleChange}
                                inputProps={{
                                    pattern: "^[A-Za-z ]+$",
                                    title: "Only letters and spaces are allowed.",
                                }}
                                fullWidth
                            />
                            <TextField
                                required
                                name="email"
                                label="Email"
                                variant="filled"
                                value={user.email}
                                onChange={handleChange}
                                type="email"
                                fullWidth
                            />
                        </div>

                        {/* Password Field */}
                        <TextField
                            id="password"
                            required
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="filled"
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
                            fullWidth
                        />

                        {/* Button Group */}
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
        </div>
    );
}

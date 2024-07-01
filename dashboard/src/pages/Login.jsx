import "./Login.css";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/signin`,
                user
            );
    
            console.log(response);
    
            const result = response.data;
            console.log(result);
            if (result.success) {
                localStorage.setItem("user", JSON.stringify(result.user));
                // Check the user's role and navigate accordingly
                if (["Admin", "Owner"].includes(result.user.role)) {
                    navigate("/dashboard"); // Navigate to the dashboard for Admins and Owners
                } else {
                    navigate("/home"); // Navigate to the home page for all other roles
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleLogin}>
                <h2>KFC! Kinseng Fried Chicken</h2>
                <TextField
                    required
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={user.email}
                    onChange={handleChange}
                    inputProps={{
                        pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                    }}
                />
                <TextField
                    id="password"
                    required
                    name="password"
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
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <p>New user? please click sign</p>
                <Button variant="contained" type="submit" className="redButton">
                    Login
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate("/signup")}
                    className="redButton"
                >
                    Sign Up
                </Button>
            </form>
        </div>
    );
}

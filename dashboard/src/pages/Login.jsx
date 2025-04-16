import "../styles/Login.css";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import pclogo from '../images/loginimage.jpg';

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    // Clear form fields and localStorage on component mount
    useEffect(() => {
        // Clear any stored credentials
        localStorage.removeItem("tempUserEmail");
        
        // Reset form fields
        setUser({
            email: "",
            password: "",
        });
        
        // Reset any browser autofill
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        
        if (emailInput) emailInput.value = "";
        if (passwordInput) passwordInput.value = "";
    }, []);

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
                `${VITE_REACT_APP_API_HOST}/api/users/signin`,
                user
            );

            console.log(response);

            const result = response.data;
            console.log(result);
            if (result.success) {
                localStorage.removeItem("cartItems");
                localStorage.setItem("user", JSON.stringify(result.user));

                if (["Admin", "Owner", "Staff"].includes(result.user.role)) {
                    navigate("/dashboard"); 
                } else {
                    navigate("/home"); 
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
            <div className="loginContent">
                <div className="loginImage">
                    <img src={pclogo} alt="PC logo" />
                </div>
                <div className="loginFormContainer">
                    <form className="loginForm" onSubmit={handleLogin} autoComplete="off">
                        <h2>Welcome! PCBuild Track</h2>
                        <TextField
                            required
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={user.email}
                            onChange={handleChange}
                            type="email"
                            autoComplete="off"
                            inputProps={{
                                autoComplete: "new-password", 
                                form: {
                                    autoComplete: "off",
                                },
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
                            autoComplete="off"
                            inputProps={{
                                autoComplete: "new-password",
                                form: {
                                    autoComplete: "off",
                                },
                            }}
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
                        <p>New user? please click signup</p>
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
            </div>
        </div>
    );
}
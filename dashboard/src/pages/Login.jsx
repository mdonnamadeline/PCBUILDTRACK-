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

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if(user.email != "admin" && user.password != "admin") {
                alert("not valid");
                return;
            }
            navigate("/dashboard");
            // const response = await axios.post(
            //     "http://localhost:1337/signin",
            //     user
            // );
            // const result = response.data;
            // if (result.success) {
            //     localStorage.setItem("user", JSON.stringify(result.user));
            //     navigate("/dashboard"); 
            // } else {
            //     alert(result.message);
            // }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleLogin}>
                <h2>KFC! Kinseng Fried Chicken</h2>
                <p>Welcome Admin!</p>
                <TextField
                    required
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={user.email}
                    onChange={handleChange}
                    inputProps={{
                        pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
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

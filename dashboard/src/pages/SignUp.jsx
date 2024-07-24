import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignUp.css";
import bgimage from "../images/friedChicken.png"; 

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
        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users/signup`,
                user
            );
            const result = response.data;

            if (result.success) {
                localStorage.removeItem("cartItems");
                localStorage.removeItem("user");
                navigate("/");
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
                        <h6>REGISTER HERE!</h6>
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
                            type="email"
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
                <div className="signupImage">
                    <img src={bgimage} alt="Sign Up" />
                </div>
            </div>
        </div>
    );
}

import React, { Component } from "react";
import axios from "axios"; // Import axios
import { TextField, Box, Button, Alert, Typography, Container, Paper, InputAdornment, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import { withRouter } from "../../../helpers/withRouter";
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

interface State {
    email: string;
    password: string;
    showPassword: boolean;
    error: {
        status: boolean;
        msg: string;
        type: "error" | "success" | undefined;
    };
}

interface Props {
    navigate: (path: string) => void;
}

class UserLogin extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showPassword: false,
            error: {
                status: false,
                msg: "",
                type: undefined,
            }
        };
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = this.state;

        if (!email.trim() || !password.trim()) {
            this.setState({
                error: {
                    status: true,
                    msg: "All fields are required!",
                    type: "error",
                }
            });
            return;
        }

        try {
            // Send the login request via axios
            const response = await axios.post(`${baseApiUrl}/login`, {
                email,
                password,
            });

            const data = response.data; // Get the response data

            if (response.status === 200 && data.status === "SUCCESS") {
                // Successful login
                const userData = data.data[0]; // Assuming the response returns user data in an array
                const Dob = new Date(userData.dateOfBirth);
                const formattedDob = Dob.toLocaleDateString('en-CA');
                localStorage.setItem("userLogin/SignupDetails", JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    dob: formattedDob

                }));
                localStorage.setItem("userIsUp", "true");

                this.setState({
                    error: {
                        status: true,
                        msg: "Login Successful! Redirecting...",
                        type: "success",
                    },
                    email: "",
                    password: "",
                });

                setTimeout(() => {
                    this.props.navigate("/"); // Redirect to the home page or desired route
                }, 1500);
            } else {
                // Error in login
                this.setState({
                    error: {
                        status: true,
                        msg: data.message || "Login failed. Please check your credentials.",
                        type: "error",
                    }
                });
            }
        } catch (err) {
            // Handle network or other errors
            console.error("Login error:", err); // Log the error for debugging
            this.setState({
                error: {
                    status: true,
                    msg: "An error occurred while logging in. Please try again.",
                    type: "error",
                }
            });
        }
    };

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
    };

    render() {
        return (
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        Welcome Back! 👋
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb={2}>
                        Please enter your credentials to log in.
                    </Typography>

                    <Box component="form" noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            id="email"
                            name="email"
                            label="Email Address"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            id="password"
                            name="password"
                            label="Password"
                            type={this.state.showPassword ? "text" : "password"}
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={this.togglePasswordVisibility} edge="end">
                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<LoginIcon />}
                            sx={{ mt: 3, py: 1.5, textTransform: "none", fontSize: "1rem" }}
                        >
                            Login
                        </Button>
                    </Box>

                    <NavLink to="/sendpasswordresetemail" style={{ display: "block", marginTop: "15px", textDecoration: "none", color: "#1976D2" }}>
                        Forgot Password?
                    </NavLink>

                    {this.state.error.status && (
                        <Alert severity={this.state.error.type} sx={{ mt: 2 }}>
                            {this.state.error.msg}
                        </Alert>
                    )}
                </Paper>
            </Container>
        );
    }
}

export default withRouter(UserLogin);

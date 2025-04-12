import React, { Component } from "react";
import axios from "axios";
import { TextField, Box, Button, Alert, AlertColor, Typography, Container, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink, NavigateFunction, Navigate } from "react-router-dom";
import { withRouter } from "../../../helpers/withRouter";
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

interface State {
    name: string;
    email: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    error: {
        status: boolean;
        msg: string;
        type: AlertColor | undefined;
    };
}

interface Props {
    navigate: NavigateFunction;
}

class UserRegister extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
            error: {
                status: false,
                msg: "",
                type: undefined,
            }
        };
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, dateOfBirth, password, confirmPassword } = this.state;

        // Basic validation
        if (!name.trim() || !email.trim() || !dateOfBirth.trim() || !password.trim() || !confirmPassword.trim()) {
            this.setState({
                error: { status: true, msg: "All fields are required!", type: "error" }
            });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({
                error: { status: true, msg: "Passwords do not match!", type: "error" }
            });
            return;
        }

        try {
            const response = await axios.post(`${baseApiUrl}/signup`, {
                name,
                email,
                dateOfBirth,
                password
            });

            if (response.data.status === "SUCCESS") {
                // Save flag to prevent access to /register or /login
                localStorage.setItem("userIsUp", "true");
                localStorage.setItem("userLogin/SignupDetails", JSON.stringify({
                    name: name,
                    email: email,
                    dob: dateOfBirth

                }));

                this.setState({
                    error: { status: true, msg: "Registration Successful! Redirecting...", type: "success" },
                    name: "",
                    email: "",
                    dateOfBirth: "",
                    password: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    this.props.navigate("/", { replace: true });
                }, 1000);
            } else {
                this.setState({
                    error: { status: true, msg: response.data.message || "Signup Failed!", type: "error" },
                });
            }
        } catch (error: any) {
            this.setState({
                error: {
                    status: true,
                    msg: error.response?.data?.message || "Network Error! Please try again.",
                    type: "error"
                }
            });
        }
    };

    togglePasswordVisibility = (field: "showPassword" | "showConfirmPassword") => {
        this.setState((prevState) => ({ [field]: !prevState[field] } as Pick<State, typeof field>));
    };

    render() {
        // Redirect to home page if already signed up
        if (localStorage.getItem("userIsUp")) {
            return <Navigate to="/" replace />;
        }

        return (
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, mt: 6, borderRadius: 3, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        Create an Account 🎉
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb={2}>
                        Sign up to get started with amazing features.
                    </Typography>

                    <Box component="form" noValidate id="register-form" onSubmit={this.handleSubmit}>
                        <TextField fullWidth required margin="normal" label="Full Name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                        <TextField fullWidth required margin="normal" label="Email Address" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                        <TextField fullWidth required margin="normal" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={this.state.dateOfBirth} onChange={(e) => this.setState({ dateOfBirth: e.target.value })} />
                        
                        <TextField 
                            fullWidth 
                            required 
                            margin="normal" 
                            label="Password" 
                            type={this.state.showPassword ? "text" : "password"} 
                            value={this.state.password} 
                            onChange={(e) => this.setState({ password: e.target.value })} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => this.togglePasswordVisibility("showPassword")}>
                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField 
                            fullWidth 
                            required 
                            margin="normal" 
                            label="Confirm Password" 
                            type={this.state.showConfirmPassword ? "text" : "password"} 
                            value={this.state.confirmPassword} 
                            onChange={(e) => this.setState({ confirmPassword: e.target.value })} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => this.togglePasswordVisibility("showConfirmPassword")}>
                                            {this.state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5, textTransform: "none", fontSize: "1rem" }}>Sign Up</Button>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account? <NavLink to="/login" style={{ textDecoration: "none", color: "#1976D2" }}>Login</NavLink>
                        </Typography>
                    </Box>

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

export default withRouter(UserRegister);

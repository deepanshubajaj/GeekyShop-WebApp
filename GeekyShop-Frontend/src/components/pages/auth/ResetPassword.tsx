import React, { Component } from "react";
import { Grid, Card, TextField, Button, Box, Typography, IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
import PassChangeImage from "../../../assets/undrawPassChange.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

// State interface
interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
  message: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

class ResetPassword extends Component<{}, ResetPasswordState> {
  state: ResetPasswordState = {
    newPassword: "",
    confirmPassword: "",
    message: "",
    showPassword: false,
    showConfirmPassword: false,
  };

  // Handle input changes
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Toggle password visibility
  handleTogglePasswordVisibility = (field: keyof ResetPasswordState) => {
    this.setState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle password reset
  handleSubmit = async () => {
    const { newPassword, confirmPassword } = this.state;

    if (!newPassword || !confirmPassword) {
      this.setState({ message: "Please fill in both fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({ message: "Passwords do not match. Please try again." });
      return;
    }

    const storedUser = localStorage.getItem("userPassResetDetails");
    let userId = null;
    let resetPasswordCode = null;

    if (storedUser) {
      const userDetails = JSON.parse(storedUser);
      userId = userDetails.userUseridPR;
      resetPasswordCode = userDetails.userCodePR;
    } else {
      console.log("No user data found in localStorage.");
    }

    try {
      const response = await axios.post(`${baseApiUrl}/reset-password`, {
        userId,
        resetPasswordCode,
        newPassword,
      });

      if (response.data.status === "SUCCESS") {
        this.setState({ message: response.data.message });

        localStorage.removeItem("userIsUpRP");
        localStorage.removeItem("userPassResetDetails");

        setTimeout(() => {
          window.location.href = "/login"; // Redirect after success
        }, 2000);
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error) {
      this.setState({ message: "An error occurred. Please try again later." });
    }
  };

  render() {
    const { newPassword, confirmPassword, message, showPassword, showConfirmPassword } = this.state;

    return (
      <Grid container sx={{ height: "88vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f9" }}>
        <Grid
          sx={{
            flex: { xs: 12, md: 6 },
            backgroundImage: `url(${PassChangeImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain", // Keep it as 'cover' to fill the area
            backgroundPosition: "center",
            borderRadius: 3,
            boxShadow: 4,
            display: { xs: "none", sm: "block" },
            height: "600px", // Set a fixed height
          }}
        />

        <Grid sx={{ flex: { xs: 12, md: 6 }, padding: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{ width: "100%", maxWidth: 450, padding: 4, borderRadius: 3, boxShadow: 3, background: "#ffffff" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" }}>
              Reset Your Password
            </Typography>

            <Typography sx={{ textAlign: "center", marginBottom: 3 }}>
              Enter your new password and confirm it to reset your password.
            </Typography>

            <form>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                name="newPassword"
                value={newPassword}
                onChange={this.handleInputChange}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => this.handleTogglePasswordVisibility("showPassword")}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => this.handleTogglePasswordVisibility("showConfirmPassword")}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: "12px", borderRadius: 3, textTransform: "none", fontWeight: "bold" }}
                onClick={this.handleSubmit}
              >
                Set New Password
              </Button>
            </form>

            {message && (
              <Box sx={{ marginTop: 2, textAlign: "center", color: message.includes("successfully") ? "green" : "red" }}>
                <Typography>{message}</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default ResetPassword;

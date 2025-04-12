import React, { Component } from "react";
import { Grid, Card, TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import axios from "axios";
import ForgetPasswordImage from "../../../assets/undrawForgotPassword.png";
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

class SendPasswordResetEmail extends Component {
  state = {
    email: "",
    message: "",
    openDialog: false,
    userId: "",
    resetCode: "",
    enteredCode: "",
    errorMessage: "",
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = async () => {
    const { email } = this.state;

    if (email) {
      try {
        const response = await axios.post(`${baseApiUrl}/forgot-password`, { email });
        const data = response.data;

        if (data.status === "SUCCESS") {
          // Store the email, reset code, and user ID in localStorage
          localStorage.setItem("userIsUpRP", "true"); 
          localStorage.setItem("userPassResetDetails",JSON.stringify({
            userEmailPR: email,
            userCodePR: data.code,
            userUseridPR: data.userId
          }));
        

          this.setState({
            message: "Password reset email sent successfully!",
            openDialog: true, 
            resetCode: data.code, 
          });
        } else {
          this.setState({ message: "Failed to send reset email." });
        }
      } catch (error) {
        this.setState({
          message: "An error occurred. Please try again later.",
        });
      }
    } else {
      this.setState({
        message: "Please enter a valid email address.",
      });
    }
  };

  handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ enteredCode: event.target.value });
  };

  handleVerifyCode = () => {
    const { enteredCode, resetCode } = this.state;

    if (enteredCode === resetCode) {
      this.setState({ openDialog: false });
      // Redirect to reset password page
      window.location.href = "/resetpassword";
    } else {
      this.setState({ errorMessage: "Invalid reset code. Please try again." });
    }
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  render() {
    const { email, message, openDialog, enteredCode, errorMessage } = this.state;

    return (
      <Grid container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f9", overflow: "hidden" }}>
        <Grid sx={{ flex: { xs: 12, md: 6 }, padding: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100%", overflow: "hidden" }}>
          <Card sx={{ width: "100%", maxWidth: 450, padding: 4, borderRadius: 3, boxShadow: 3, background: "#ffffff", '&:hover': { boxShadow: 6 }, overflow: "hidden" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" }}>
              Forgot your password?
            </Typography>

            <Typography sx={{ textAlign: "center", marginBottom: 3 }}>
              Enter your email address and we will send you a password reset link.
            </Typography>

            <form>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={email}
                onChange={this.handleInputChange}
                sx={{ marginBottom: 2, borderRadius: 2, backgroundColor: "#f9f9f9", '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: "12px", borderRadius: 3, textTransform: "none", fontWeight: "bold", '&:hover': { backgroundColor: "#0056b3" } }}
                onClick={this.handleSubmit}
              >
                Send Reset Email
              </Button>
            </form>

            {message && (
              <Box sx={{ marginTop: 2, textAlign: "center", color: message.includes("sent") ? "green" : "red" }}>
                <Typography>{message}</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid
          sx={{
            flex: { xs: 12, md: 6 },
            height: "auto",
            minHeight: "500px",
            backgroundImage: `url(${ForgetPasswordImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            borderRadius: 3,
            boxShadow: 4,
            display: { xs: "none", sm: "block" },
          }}
        />

        {/* Reset Code Dialog */}
        <Dialog
          open={openDialog}
          onClose={this.handleCloseDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 5,
              padding: 2,
              backgroundColor: "#f9f9f9",
              minWidth: 350,
              maxWidth: 400,
              height: "auto",
              minHeight: "300px",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              borderRadius: "2px 2px 0 0",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            Enter Reset Code
          </DialogTitle>

          <DialogContent sx={{ padding: "24px", overflow: "visible" }}>
            <TextField
              label="Reset Code"
              variant="outlined"
              fullWidth
              value={enteredCode}
              onChange={this.handleCodeChange}
              sx={{
                marginBottom: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  minHeight: "50px",
                  overflow: "visible",
                },
              }}
              autoFocus
            />
            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  mt: 1,
                  backgroundColor: "#fdecea",
                  color: "#b71c1c",
                  borderRadius: 1,
                }}
              >
                {errorMessage}
              </Alert>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              padding: "16px",
              gap: 1,
            }}
          >
            <Button
              onClick={this.handleVerifyCode}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#0d47a1",
                },
                borderRadius: 2,
                fontWeight: "bold",
                padding: "10px 20px",
                minWidth: "120px",
              }}
            >
              Continue
            </Button>
            <Button
              onClick={this.handleCloseDialog}
              color="secondary"
              sx={{
                backgroundColor: "#e0e0e0",
                "&:hover": {
                  backgroundColor: "#bdbdbd",
                },
                borderRadius: 2,
                padding: "10px 20px",
                minWidth: "120px",
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default SendPasswordResetEmail;

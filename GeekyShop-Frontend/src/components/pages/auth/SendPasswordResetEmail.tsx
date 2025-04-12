import React, { Component } from "react";
import {
  Grid, Card, TextField, Button, Box, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle, Alert
} from "@mui/material";
import axios from "axios";
import ForgetPasswordImage from "../../../assets/undrawForgotPassword.png";
import { withRouter } from "../../../helpers/withRouter";

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

// Props type to support `navigate`
interface Props {
  navigate: (path: string) => void;
}

interface State {
  email: string;
  message: string;
  openDialog: boolean;
  userId: string;
  resetCode: string;
  enteredCode: string;
  errorMessage: string;
}

class SendPasswordResetEmail extends Component<Props, State> {
  state: State = {
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
          localStorage.setItem("userIsUpRP", "true");
          localStorage.setItem("userPassResetDetails", JSON.stringify({
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

      // Navigation
      this.props.navigate("/resetpassword");
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
      <Grid container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f9" }}>
        <Grid sx={{ flex: { xs: 12, md: 6 }, padding: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Card sx={{ width: "100%", maxWidth: 450, padding: 4, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center" }}>
              Forgot your password?
            </Typography>
            <Typography sx={{ textAlign: "center", marginBottom: 3 }}>
              Enter your email address and we will send you a password reset link.
            </Typography>

            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={this.handleInputChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "12px", borderRadius: 3 }}
              onClick={this.handleSubmit}
            >
              Send Reset Email
            </Button>

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
            backgroundImage: `url(${ForgetPasswordImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            display: { xs: "none", sm: "block" },
          }}
        />

        {/* Reset Code Dialog */}
        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Enter Reset Code</DialogTitle>
          <DialogContent>
            <TextField
              label="Reset Code"
              variant="outlined"
              fullWidth
              value={enteredCode}
              onChange={this.handleCodeChange}
              autoFocus
              sx={{ marginBottom: 2 }}
            />
            {errorMessage && (
              <Alert severity="error">{errorMessage}</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleVerifyCode} variant="contained" color="primary">Continue</Button>
            <Button onClick={this.handleCloseDialog} color="secondary">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

// Export with withRouter
export default withRouter(SendPasswordResetEmail);

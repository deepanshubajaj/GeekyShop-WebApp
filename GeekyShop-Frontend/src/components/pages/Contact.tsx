import React, { Component } from "react";
import { Grid, Card, TextField, Button, Typography, Snackbar } from "@mui/material";
import axios from "axios"; // Import axios
import ContactImage from "../../assets/undrawPersonalEmail.png";
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

// Defining the IState interface
interface IState {
  name: string;
  email: string;
  message: string;
  successMessage: string;
  errorMessage: string;
  openSnackbar: boolean;
}

class Contact extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      successMessage: "",
      errorMessage: "",
      openSnackbar: false,
    };
  }

  // Handle input change explicitly
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Explicitly update each field in the state
    if (name === "name") {
      this.setState({ name: value });
    } else if (name === "email") {
      this.setState({ email: value });
    } else if (name === "message") {
      this.setState({ message: value });
    }
  };

  // Handle form submission
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = this.state;

    // Validate inputs
    if (!name || !email || !message) {
      this.setState({ errorMessage: "All fields are required!", openSnackbar: true });
      return;
    }

    // Data to send to the API
    const contactData = {
      name,
      email,
      message,
    };

    // Call the API using axios
    axios
      .post(`${baseApiUrl}/contact-form`, contactData)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          this.setState({
            successMessage: "You have Contacted the Developer Successfully.",
            openSnackbar: true,
          });
          // Clear form fields after success
          this.setState({ name: "", email: "", message: "" });
        }
      })
      .catch((error) => {
        console.error("There was an error sending the contact form:", error);
        this.setState({
          errorMessage: "An error occurred while sending your message. Please try again later.",
          openSnackbar: true,
        });
      });
  };

  render() {
    const { name, email, message, successMessage, errorMessage, openSnackbar } = this.state;

    return (
      <Grid container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f9" }}>
        {/* Left Side: Contact Form */}
        <Grid
          sx={{
            flex: { xs: 12, md: 6 },
            padding: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 450,
              padding: 4,
              borderRadius: 3,
              boxShadow: 3, // Elevation for the card
              background: "#ffffff",
              '&:hover': {
                boxShadow: 6, // Add more depth on hover
              }
            }}
          >
            {/* Centered Typography */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 3,
                textAlign: "center", // Center align the text
              }}
            >
              You can reach out to me anytime by filling out this form ...
            </Typography>

            <form onSubmit={this.handleSubmit}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={this.handleChange}
                name="name"
                sx={{
                  marginBottom: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={email}
                onChange={this.handleChange}
                name="email"
                sx={{
                  marginBottom: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Enter your message here"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={message}
                onChange={this.handleChange}
                name="message"
                sx={{
                  marginBottom: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  padding: "12px",
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor: "#0056b3", // Darker hover effect
                  }
                }}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </Grid>

        {/* Right Side: Image */}
        <Grid
          sx={{
            flex: { xs: 12, md: 6 },
            height: "100%",
            backgroundImage: `url(${ContactImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "90%",
            backgroundPosition: "center",
            borderRadius: 3,
            boxShadow: 4, // Adding some shadow to the image container
            display: { xs: "none", sm: "block" }, // Hidden on small screens
          }}
        />

        {/* Snackbar for success or error message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => this.setState({ openSnackbar: false })}
          message={successMessage || errorMessage}
        />
      </Grid>
    );
  }
}

export default Contact;

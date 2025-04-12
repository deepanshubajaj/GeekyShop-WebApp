import { Component } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { withRouter } from "../helpers/withRouter";

// Props with navigate included
interface Props {
  navigate: (path: string) => void;
}

interface State {
  isLoggedIn: boolean;
}

class Navbar extends Component<Props, State> {
  state: State = {
    isLoggedIn: localStorage.getItem("userIsUp") === "true",
  };

  componentDidMount() {
    this.setState({ isLoggedIn: localStorage.getItem("userIsUp") === "true" });
  }

  handleLogout = () => {
    localStorage.removeItem("userIsUp");
    localStorage.removeItem("hasReloaded");
    localStorage.removeItem("userLogin/SignupDetails");
    this.setState({ isLoggedIn: false });

    this.props.navigate("/login");
  };

  handleLogin = () => {
    localStorage.setItem("userIsUp", "true");
    this.setState({ isLoggedIn: true });
  };

  getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    backgroundColor: isActive ? "#6d1b7b" : "transparent",
    color: "white",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "4px",
  });

  render() {
    const { isLoggedIn } = this.state;

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Geeky-Shop
            </Typography>

            <NavLink to="/about" style={this.getNavLinkStyle}>
              <Button sx={{ color: "inherit", textTransform: "none" }}>Aboutℹ️</Button>
            </NavLink>

            <NavLink to="/ethereal" style={this.getNavLinkStyle}>
              <Button sx={{ color: "inherit", textTransform: "none" }}>Ethereal Experience✨</Button>
            </NavLink>

            <NavLink to="/videoplay" style={this.getNavLinkStyle}>
              <Button sx={{ color: "inherit", textTransform: "none" }}>Watch Now📺</Button>
            </NavLink>

            <NavLink to="/game" style={this.getNavLinkStyle}>
              <Button sx={{ color: "inherit", textTransform: "none" }}>Bored? Play Now😊</Button>
            </NavLink>

            {isLoggedIn && (
              <NavLink to="/secretgame" style={this.getNavLinkStyle}>
                <Button sx={{ color: "inherit", textTransform: "none" }}>Fury Unleashed🐍</Button>
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink to="/" style={this.getNavLinkStyle}>
                <Button sx={{ color: "inherit", textTransform: "none" }}>Home🏡</Button>
              </NavLink>
            )}

            <NavLink to="/contact" style={this.getNavLinkStyle}>
              <Button sx={{ color: "inherit", textTransform: "none" }}>Contact☎️</Button>
            </NavLink>

            {isLoggedIn ? (
              <Button sx={{ color: "inherit", textTransform: "none" }} onClick={this.handleLogout}>
                Logout🔒
              </Button>
            ) : (
              <NavLink to="/login" style={this.getNavLinkStyle}>
                <Button sx={{ color: "inherit", textTransform: "none" }}>Login/Register🔓</Button>
              </NavLink>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default withRouter(Navbar);

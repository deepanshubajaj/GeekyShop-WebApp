import { Component } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { CssBaseline } from "@mui/material";

class Layout extends Component {
  render() {
    return (
      <>
        <CssBaseline />
        <Navbar />
        <Outlet />
      </>
    );
  }
}

export default Layout;

import React, { Component } from "react";
import { Grid, Card, Tabs, Tab, Box } from "@mui/material";
import Pic1 from "../../../assets/web-shopping.png";
import UserLogin from "./UserLogin";
import Registration from "./UserRegister";

interface State {
  value: number;
}

class LoginReg extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      value: 0, // Default to 'Login' tab
    };
  }

  componentDidMount() {
    const { pathname } = window.location;
    if (pathname === "/register") {
      this.setState({ value: 1 }); // Switch to 'Register' tab when on /register
    }
  }

  handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    this.setState({ value: newValue });
  };

  render() {
    const { value } = this.state;
    return (
      <Grid container sx={{ height: "90vh", display: "flex", alignItems: "flex-start" }}>
        {/* Left Side: Image background */}
        <Grid
          sx={{
            flex: { xs: 12, md: 5, lg: 7 },
            height: "100%",
            backgroundImage: `url(${Pic1})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRight: "2px solid",
            borderColor: "divider",
            display: { xs: "none", sm: "block" }, // Hidden on small screens
          }}
        />

        {/* Right Side: Card with Tabs (Scrollable) */}
        <Grid
          sx={{
            flex: { xs: 12, md: 7, lg: 5 },
            display: "flex",
            justifyContent: "center", 
            alignItems: "flex-start",
            paddingTop: 0,
            overflowY: "auto", 
            height: "100%", 
          }}
        >
          <Card sx={{ width: "100%", padding: 2 }}>
            <Box
              sx={{
                borderBottom: "2px solid",
                borderColor: "divider",
                width: "100%",
                paddingBottom: 0,
              }}
            >
              <Tabs value={value} textColor="secondary" indicatorColor="secondary" onChange={this.handleChange} centered>
                <Tab label="Login" sx={{ textTransform: "none", fontWeight: "bold" }} />
                <Tab label="Register" sx={{ textTransform: "none", fontWeight: "bold" }} />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <UserLogin />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Registration />
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

class TabPanel extends Component<TabPanelProps> {
  render() {
    const { children, value, index } = this.props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }
}

export default LoginReg;

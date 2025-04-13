import React, { useEffect, useState } from "react";
import { Grid, Card, Tabs, Tab, Box } from "@mui/material";
import Pic1 from "../../../assets/web-shopping.png";
import UserLogin from "./UserLogin";
import Registration from "./UserRegister";
import { useNavigate } from "react-router-dom";

const LoginReg = () => {
  const [value, setValue] = useState(0); // Default to 'Login' tab
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = window.location;
    if (pathname === "/register") {
      setValue(1); // Switch to 'Register' tab when on /register
    } else if (pathname === "/login") {
      setValue(0); // Switch to 'Login' tab when on /login
    }
  }, [window.location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // Navigate based on tab selection
    if (newValue === 0) {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

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
          <Box sx={{ borderBottom: "2px solid", borderColor: "divider", width: "100%", paddingBottom: 0 }}>
            <Tabs value={value} textColor="secondary" indicatorColor="secondary" onChange={handleChange} centered>
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
};

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default LoginReg;

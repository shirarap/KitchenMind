import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUserData } from "../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person"; 

const Navbar = ({ openLoginModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const inventoryItems = useSelector((state) => state.products.items);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserData());
    }
  }, [isAuthenticated, dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navButtonStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
  };


  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#748AA4",
        direction: "rtl",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: 85 }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/logo.png"
            alt="Kitchen Mind Logo"
            style={{ height: 80 }}
          />
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            בית
          </Button>
          <Button color="inherit" component={Link} to="/about" sx={navButtonStyle}>
            אודות
          </Button>
     
          <Button color="inherit" component={Link} to="/inventory" sx={navButtonStyle}>
             מלאי ({inventoryItems.length})
           </Button>
          <Button color="inherit" component={Link} to="/shopping-list" sx={navButtonStyle}>
            רשימת קניות
          </Button>
       <Button color="inherit" component={Link} to="/recipes" sx={navButtonStyle}>
     מתכונים
</Button>
        </Box>
       
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ fontSize: "2rem", color: "#fff" }}>
                  <PersonIcon sx={{ fontSize: "inherit" }} />
                </IconButton>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
                  {user.name || "שם משתמש"}
                </Typography>
              </Box>
              <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
                התנתק
              </Button>
            </>
          ) : (
            <IconButton color="inherit" onClick={openLoginModal} sx={{
              fontSize: "2rem",            
              color: "#fff",             
              border: "1px solid #fff",  
              borderRadius: "50%", 
              padding: "8px", 
              '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 0.2)", 
              }
            }}>
              <PersonIcon sx={{ fontSize: "inherit" }} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
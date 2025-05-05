import React from "react";
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
import { logout } from "../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person"; // אייקון של איש

const Navbar = ({ openLoginModal }) => {  // הוספנו את פרמטר הפונקציה
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
        {/* צד ימין: לוגו וכפתורי ניווט */}
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
אודות          </Button>
      

          <Button color="inherit" component={Link} to="/inventory" sx={navButtonStyle}>
            מלאי
          </Button>
          <Button color="inherit" component={Link} to="/shopping-list" sx={navButtonStyle}>
            רשימת קניות
          </Button>
         
          </Box>
        {/* צד שמאל: מידע על המשתמש */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ fontSize: "2rem", color: "#fff" }}>
                  <PersonIcon sx={{ fontSize: "inherit" }} />
                </IconButton>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
                  {user.email || "משתמש"}
                </Typography>
              </Box>
              <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
                התנתק
              </Button>
            </>
          ) : (
            <IconButton color="inherit" onClick={openLoginModal} sx={{
              fontSize: "2rem",             // גודל אייקון גדול יותר
              color: "#fff",                // צבע אייקון לבן
              border: "1px solid #fff",     // מסגרת לבנה מסביב לאייקון
              borderRadius: "50%",          // עיגול לאייקון
              padding: "8px",               // ריווח פנימי לאייקון
              '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 0.2)", // רקע בהובר אם רוצים
              }
            }}>
              <PersonIcon sx={{ fontSize: "inherit" }} /> {/* אייקון של איש */}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

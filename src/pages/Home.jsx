import React, { useState } from "react";
import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailure, registerSuccess } from "../features/auth/authSlice";  // אקשנים

const Home = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // מגדיר אם המשתמש כבר נרשם
  const [userName, setUserName] = useState(""); // שם המשתמש
  const [email, setEmail] = useState(""); // אימייל
  const [password, setPassword] = useState(""); // סיסמה

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleRegister = () => setIsRegistered(!isRegistered); // מתחלף בין הרשמה להתחברות

  const handleSubmit = async () => {
    dispatch(loginRequest()); // שולח בקשה להתחברות או הרשמה
    try {
      if (isRegistered) {
        // התחברות
        // כאן תוכל להוסיף את הלוגיקה של התחברות (למשל, קריאה ל-API)
        dispatch(loginSuccess({ email, userName }));
      } else {
        // הרשמה
        // כאן תוכל להוסיף את הלוגיקה של הרשמה (למשל, קריאה ל-API)
        dispatch(registerSuccess({ email, userName }));
      }
      handleClose(); // סגירת הפופ-אפ
    } catch (error) {
      dispatch(loginFailure(error.message)); // במקרה של שגיאה
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // מיקום במרכז
        paddingTop: "20px", // ריווח קטן מלמעלה
        color: "#fff", // צבע טקסט לבן
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)", // הצללה חזקה
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          fontSize: "4.5rem",             // גודל גופן גדול
          fontWeight: "bold",           // גופן עבה
          textAlign: "center",          // יישור למרכז
          color: "#fff",                // צבע טקסט לבן
          textStroke: "1.5px #828799",    // מסגרת של 2px בצבע #828799
          WebkitTextStroke: "1.5px #828799", // תמיכה ב-WebkitTextStroke לדפדפנים מודרניים
          marginBottom: "20px",         // רווח בין הכיתוב לכפתור
        }}
      >
        ברוכים הבאים <br />Kitchen Mind
      </Typography>

      <br />

      {userName ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            שלום, {userName}!
          </Typography>
        </Box>
      ) : (
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#5D7266", // ירוק
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "25px",       // עיגול פינות
            boxShadow: "0 3px 5px rgba(0,0,0,0.3)", // הצללה
            paddingX: 3,
            paddingY: 1,
            '&:hover': {
              backgroundColor: "#758F80",
            },
          }}
        >
          התחבר / הירשם
        </Button>
      )}

      {/* מודל התחברות */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">{isRegistered ? "התחברות" : "הירשם"}</Typography>
          {/* טופס הרשמה או התחברות */}
          {!isRegistered && (
            <>
              <TextField 
                label="שם מלא" 
                fullWidth 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
              />
            </>
          )}
          <TextField 
            label="אימייל" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            label="סיסמה" 
            type="password" 
            fullWidth 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#FFC8A4", // צבע רקע חדש
              color: "#fff",               // צבע טקסט לבן
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "25px",        // עיגול פינות
              boxShadow: "0 3px 5px rgba(0,0,0,0.3)", // הצללה
              paddingX: 3,
              paddingY: 1,
              '&:hover': {
                backgroundColor: "#EBB798", // צבע רקע כהה יותר בהובר
              },
            }}
          >
            {isRegistered ? "התחבר" : "הירשם"}
          </Button>

          {/* כפתור להחלפת בין הרשמה להתחברות */}
          <Button
            variant="text"
            onClick={toggleRegister}
            sx={{
              color: "#5D7266",
              fontSize: "0.9rem",
              textAlign: "center",
              backgroundColor: "transparent",   // רקע שקוף    
              ":hover": {
                backgroundColor: "transparent", // רקע שקוף בהובר
              },
              
            }}
          >
            {isRegistered ? "לא רשום? הירשם" : "כבר רשום? התחבר"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;

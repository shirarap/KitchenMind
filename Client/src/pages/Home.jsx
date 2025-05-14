import React, { useState } from "react";
import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
 
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); 
  const [userName, setUserName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  const handleSubmit = async () => {
    

    try {
  
        // התחברות
        const dataUser =await axios.post('http://localhost:3000/user/loginUser', {
          email,
          password
        });
        alert(password);
        dispatch(loginSuccess({ dataUser }));
      } 
        // הרשמה
        //    const dataUser =await axios.post("http://localhost:3000/user/registerUser", {
        //   email,
        //   password,
        //   UserName
        // });
      


      handleClose(); // סגירת הפופ-אפ
    } 
    catch (error) {
      alert(error.message)
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
        justifyContent: "center",
        paddingTop: "20px",
        color: "#fff",
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {/* תמונה קרובה לטקסט, מעליו */}
        <img
          src="/name.png"
          alt="Kitchen Mind Logo"
          style={{
            maxWidth: "23%",
            height: "auto",
            marginBottom: "-40px", // מוריד את המרווח מהכיתוב שמתחת
            marginRight: "140px",  // מותאם לשפה מימין לשמאל
            filter: "drop-shadow(1px 1px 3px rgba(0,0,0,0.6))",
          }}
        />

        {/* כיתוב ברוכים הבאים */}
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontSize: "2.7rem",
            fontWeight: "bold",
            color: "black",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            marginBottom: "60px",
            marginRight: "150px",
          }}
        >
          ברוכים הבאים
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
              marginTop: "-120px", // מרווח שלילי כדי להרים את הכפתור
              marginRight: "120px",
              '&:hover': {
                backgroundColor: "#758F80",
              },
            }}
          >
            התחבר / הירשם
          </Button>
        )}
      </Box>


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

export default Home;

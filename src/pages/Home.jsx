import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, TextField, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError, fetchUserData } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    UserName: "",
    email: "",
    password: "",
  });
  const [apiTest, setApiTest] = useState({ loading: false, result: null, error: null });

  // בודק אם המשתמש כבר מחובר בעת טעינת הדף
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserData());
    }
  }, [token, user, dispatch]);

  // פונקציה לבדיקת תקינות השרת
  const testApiConnection = async () => {
    setApiTest({ loading: true, result: null, error: null });
    try {
      const response = await fetch("http://localhost:3000/api/health", {
        method: "GET"
      });
      
      const isOk = response.ok;
      const data = await response.json().catch(() => ({ message: "לא התקבל JSON תקין" }));
      
      setApiTest({ 
        loading: false, 
        result: isOk ? "חיבור לשרת תקין" : "חיבור לשרת לא תקין", 
        error: isOk ? null : data.message || "שגיאה לא ידועה" 
      });
    } catch (err) {
      setApiTest({ 
        loading: false, 
        result: "שגיאת חיבור לשרת", 
        error: `לא ניתן להתחבר לשרת: ${err.message}` 
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    dispatch(clearError());
  };
  
  const handleClose = () => setOpen(false);
  
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
    // איפוס שדות הטופס בעת החלפה בין מצבים
    setFormData({
      UserName: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (isLogin) {
      return formData.email && formData.password;
    } else {
      return formData.UserName && formData.email && formData.password;
    }
  };

  const handleSubmit = async () => {
    console.log(`Attempting to ${isLogin ? 'login' : 'register'} with:`, formData);
    
    try {
      if (isLogin) {
        // התחברות
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();
      } else {
        // הרשמה
        await dispatch(registerUser({
          UserName: formData.UserName,
          email: formData.email,
          password: formData.password,
        })).unwrap();
      }
      
      console.log(`${isLogin ? 'Login' : 'Registration'} successful`);
      handleClose(); // סגירת המודל רק אם ההתחברות/הרשמה הצליחה
      navigate('/inventory'); // ניתוב לדף מלאי אחרי התחברות מוצלחת
      
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, err);
      // השגיאות כבר מטופלות ב-Redux slice
    }
  };

  const isButtonDisabled = loading || !validateForm();

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
            marginBottom: "-40px",
            marginRight: "140px",
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

        {user ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: "2rem", fontWeight: "bold" ,  marginBottom: "60px",
            marginRight: "150px",color:"#828799", textShadow: "0px 0px 0px rgba(0,0,0,0.5)" }}
            >
              שלום, {user.name }!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/inventory')}
              sx={{
                backgroundColor: "#5D7266",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "25px",
                boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
                paddingX: 3,
                paddingY: 1,
             
              
            marginRight: "150px",
                "&:hover": {
                  backgroundColor: "#758F80",
                },
              }}
            >
              צפה במלאי שלך
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: "#5D7266",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "25px",
                boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
                paddingX: 3,
                paddingY: 1,
                marginTop: "-120px",
                marginRight: "120px",
                "&:hover": {
                  backgroundColor: "#758F80",
                },
              }}
            >
              התחבר / הירשם
            </Button>
            
            {/* תוספת של כפתור בדיקת חיבור
            <Button
              variant="outlined"
              onClick={testApiConnection}
              disabled={apiTest.loading}
              sx={{
                color: "#5D7266",
                borderColor: "#5D7266",
                fontSize: "0.9rem",
                fontWeight: "bold",
                borderRadius: "25px",
                marginTop: "20px",
                marginRight: "120px",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderColor: "#758F80",
                },
              }}
            >
              {apiTest.loading ? <CircularProgress size={20} /> : "בדוק חיבור לשרת"}
            </Button> */}
            
            {apiTest.result && (
              <Alert 
                severity={apiTest.error ? "error" : "success"}
                sx={{ 
                  marginTop: "10px", 
                  marginRight: "40px", 
                  width: "280px", 
                  backgroundColor: "rgba(255, 255, 255, 0.9)"
                }}
              >
                {apiTest.result}
                {apiTest.error && <div>{apiTest.error}</div>}
              </Alert>
            )}
          </Box>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" align="center">{isLogin ? "התחברות" : "הרשמה"}</Typography>
          
          {error && (
            <Alert severity="error" sx={{ wordBreak: "break-word" }}>
              {error}
            </Alert>
          )}
          
          {/* שדות הטופס */}
          {!isLogin && (
            <TextField
              label="שם מלא"
              name="UserName"
              fullWidth
              value={formData.UserName}
              onChange={handleChange}
              required
              dir="rtl"
              error={!isLogin && formData.UserName === ""}
            />
          )}
          
          <TextField
            label="אימייל"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            dir="rtl"
            error={formData.email === ""}
          />
          
          <TextField
            label="סיסמה"
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            dir="rtl"
            error={formData.password === ""}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            sx={{
              backgroundColor: "#5D7266",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "25px",
              boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
              paddingX: 3,
              paddingY: 1,
              "&:hover": {
                backgroundColor: "#758F80",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? "התחבר" : "הירשם"
            )}
          </Button>

          {/* כפתור להחלפת בין הרשמה להתחברות */}
          <Button
            variant="text"
            onClick={toggleLoginRegister}
            sx={{
              color: "#5D7266",
              fontSize: "0.9rem",
              textAlign: "center",
              backgroundColor: "transparent",
              ":hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            {isLogin ? "לא רשום? הירשם" : "כבר רשום? התחבר"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
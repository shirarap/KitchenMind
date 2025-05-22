import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, deleteProduct } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";

const InventoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);  // קבלת ה־token מ־Redux
  const { items: products, status, error } = useSelector((state) => state.products);
  
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expirationDate: "",
    category: "",
  });

  // בדיקה אם המשתמש מחובר, אם לא - ניווט לדף הבית
  useEffect(() => {
    if (!token) {
      navigate("/");  // אם אין token, יש לנווט לדף הבית
      return;
    }
    
    // טעינת המוצרים כאשר הדף נטען
    dispatch(fetchProducts());
  }, [dispatch, token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.quantity || !formData.category) {
      return;
    }

    try {
      // שליחה לשרת עם ה־token בכותרת Authorization
      await dispatch(addProduct({
        name: formData.name,
        quantity: Number(formData.quantity),
        expirationDate: formData.expirationDate || null,
        category: formData.category,
        token: token,  // הוספת ה־token כאן
      })).unwrap();
      
      // איפוס הטופס לאחר הוספה מוצלחה
      setFormData({ name: "", quantity: "", expirationDate: "", category: "" });
    } catch (err) {
      console.error("שגיאה בהוספת מוצר:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (err) {
      console.error("שגיאה במחיקת מוצר:", err);
    }
  };

  // מציג טעינה אם הנתונים עדיין נטענים
  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/shelf.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center -310px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 5,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 4,
          borderRadius: 2,
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          ניהול מלאי
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* טופס הוספת מוצר */}
        <Typography variant="h6" gutterBottom>
          הוספת מוצר חדש
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="שם המוצר"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="כמות"
              name="quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="תאריך תפוגה"
              name="expirationDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="קטגוריה"
              name="category"
              fullWidth
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleAdd}
              sx={{
                backgroundColor: "#5D7266",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#758F80",
                },
              }}
            >
              הוסף
            </Button>
          </Grid>
        </Grid>

        {/* רשימת מוצרים */}
        <Typography variant="h6" mt={4}>
          מוצרים במלאי:
        </Typography>
        {products.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
            אין מוצרים במלאי
          </Typography>
        ) : (
          <List>
            {products.map((product) => (
              <ListItem
                key={product._id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${product.name} - ${product.quantity} יחידות (${product.category})`}
                  secondary={
                    product.expirationDate
                      ? `תוקף עד: ${new Date(
                          product.expirationDate
                        ).toLocaleDateString("he-IL")}`
                      : "ללא תאריך תפוגה"
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default InventoryPage;

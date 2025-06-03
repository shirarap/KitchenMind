import React, { useEffect, useState } from "react";
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
  Snackbar,
} from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const InventoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { items: products, status, error } = useSelector((state) => state.products);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    dispatch(fetchProducts());
  }, [dispatch, token, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(
        addProduct({
          name: data.name,
          quantity: Number(data.quantity),
          expirationDate: data.expirationDate || null,
          category: data.category,
        })
      ).unwrap();
      reset();
      dispatch(fetchProducts());
    } catch (err) {
      console.error("שגיאה בהוספת מוצר:", err);
    }
  };

  const handleDeleteAndMoveToList = async (id) => {
    try {
      await axios.patch(`/api/products/moveToShoppingList/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchProducts());
      setSnackbarOpen(true);
    } catch (err) {
      console.error("שגיאה בהעברת מוצר לרשימת קניות:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/inventory.png')",
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          הוספת מוצר חדש
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="שם המוצר"
                fullWidth
                {...register("name", { required: "שדה חובה" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="כמות"
                type="number"
                fullWidth
                {...register("quantity", {
                  required: "שדה חובה",
                  min: { value: 1, message: "כמות חייבת להיות לפחות 1" },
                })}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="תאריך תפוגה"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                {...register("expirationDate")}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="קטגוריה"
                fullWidth
                {...register("category", { required: "שדה חובה" })}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
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
        </form>

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
                  <IconButton edge="end" onClick={() => handleDeleteAndMoveToList(product._id)}>
                    <RemoveShoppingCartIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${product.name} - ${product.quantity} יחידות (${product.category})`}
                  secondary={
                    product.expirationDate
                      ? `תוקף עד: ${new Date(product.expirationDate).toLocaleDateString("he-IL")}`
                      : "ללא תאריך תפוגה"
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="המוצר הועבר לרשימת הקניות ונמחק מהמלאי"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default InventoryPage;

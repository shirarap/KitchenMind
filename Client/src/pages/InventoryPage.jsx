import React, { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useInventory } from "../hooks/useInventory";

const InventoryPage = () => {
  const { products, add, remove } = useInventory();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.quantity) return;

    add({
      name: formData.name,
      quantity: Number(formData.quantity),
      expiryDate: formData.expiryDate || null,
    });

    setFormData({ name: "", quantity: "", expiryDate: "" });
  };

  const handleDelete = (id) => {
    remove(id);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/shelf.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundPosition: "center -310px",
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

        {/* טופס הוספת מוצר */}
        <Typography variant="h6" gutterBottom>
          הוספת מוצר חדש
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="שם המוצר"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="כמות"
              name="quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="תאריך תפוגה"
              name="expiryDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" fullWidth onClick={handleAdd}>
              הוסף
            </Button>
          </Grid>
        </Grid>

        {/* רשימת מוצרים */}
        <Typography variant="h6" mt={4}>
          מוצרים במלאי:
        </Typography>
        <List>
          {products.map((product) => (
            <ListItem
              key={product.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${product.name} - ${product.quantity} יחידות`}
                secondary={
                  product.expiryDate
                    ? `תוקף עד: ${new Date(
                        product.expiryDate
                      ).toLocaleDateString("he-IL")}`
                    : "ללא תאריך תפוגה"
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InventoryPage;

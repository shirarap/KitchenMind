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

/**
 * עמוד ניהול מלאי - כולל הצגת מוצרים והוספת חדשים
 */
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

    // ניקוי שדות
    setFormData({ name: "", quantity: "", expiryDate: "" });
  };

  const handleDelete = (id) => {
    remove(id);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>ניהול מלאי</Typography>

      {/* טופס הוספת מוצר */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">הוספת מוצר חדש</Typography>
        <Grid container spacing={2} alignItems="center" mt={1}>
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
      </Paper>

      {/* רשימת מוצרים קיימים */}
      <Typography variant="h6">מוצרים במלאי:</Typography>
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
                  ? `תוקף עד: ${new Date(product.expiryDate).toLocaleDateString("he-IL")}`
                  : "ללא תאריך תפוגה"
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default InventoryPage;

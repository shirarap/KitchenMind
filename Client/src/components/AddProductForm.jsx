import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addProduct } from "../features/products/productSlice";

export default function AddProductForm({ open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    await dispatch(addProduct(data));
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>הוסף מוצר חדש</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="שם מוצר" fullWidth margin="normal" {...register('name')} required />
          <TextField label="כמות" fullWidth margin="normal" type="number" {...register('quantity')} required />
          <TextField label="תוקף" fullWidth margin="normal" type="date" {...register('expiryDate')} InputLabelProps={{ shrink: true }} required />
          <DialogActions>
            <Button onClick={onClose}>ביטול</Button>
            <Button
              type="submit" // כפתור זה ישלח את הטופס
              variant="contained"
              sx={{
                backgroundColor: "#5D7266", // צבע ירוק מותאם אישית
                color: "#fff", // צבע טקסט לבן
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "25px", // עיגול פינות
                boxShadow: "none", // ללא הצללה
                paddingX: 3,
                paddingY: 1,
                "&:hover": {
                  backgroundColor: "#758F80", // רקע כהה יותר בהובר
                },
                "&.MuiButton-contained": { // מוודא שהכפתור לא יקבל את צבע ברירת המחדל
                  backgroundColor: "#5D7266", 
                },
              }}
            >
              הוסף
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

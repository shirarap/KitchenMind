import React, { useEffect, useState } from "react";
import {
  Box, Typography, List, ListItem, ListItemText, Divider,
  Checkbox, Button, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Snackbar
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from '@mui/icons-material/Email';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShoppingList,
  toggleBoughtStatus,
  deleteBoughtItems,
  addShoppingItem
} from "../features/shoppingList/shoppingListSlice";

const ShoppingListPage = () => {
  const dispatch = useDispatch();
  const { items: shoppingList, status, error } = useSelector((state) => state.shoppingList);

  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchShoppingList());
  }, [dispatch]);

  const handleToggleBought = async (item) => {
    try {
      await dispatch(toggleBoughtStatus({ id: item._id, bought: !item.bought })).unwrap();
      if (!item.bought) {
        setSnackbar({
          open: true,
          message: "הפריט נוסף למלאי!",
          severity: "success"
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "שגיאה בעדכון הפריט",
        severity: "error"
      });
    }
  };

  const handlePrint = () => {
    const unboughtItems = shoppingList.filter(item => !item.bought);
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
      <html><head><style>
      body { direction: rtl; font-family: Calibri; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: right; }
      </style></head><body>
      <h1 style="text-align:center;">רשימת קניות</h1>
      <table><tbody>
        ${unboughtItems.map(item => `
          <tr>
            <td>${item.quantity}</td>
            <td>${item.name}</td>
          </tr>`).join("")}
      </tbody></table></body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSendEmail = () => {
    const itemsToSend = shoppingList.filter(item => item.name && item.quantity);
    const subject = encodeURIComponent("רשימת קניות");
    const body = encodeURIComponent(
      itemsToSend.map(item =>
        `${item.quantity} - ${item.name} ${item.bought ? "(נרכש)" : ""}`
      ).join("\n")
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDeleteBought = async () => {
    try {
      const boughtItemsCount = shoppingList.filter(item => item.bought).length;
      if (boughtItemsCount === 0) {
        setSnackbar({
          open: true,
          message: "אין פריטים נרכשים למחיקה",
          severity: "info"
        });
        return;
      }

      await dispatch(deleteBoughtItems()).unwrap();
      setSnackbar({
        open: true,
        message: `נמחקו ${boughtItemsCount} פריטים נרכשים`,
        severity: "success"
      });
    } catch {
      setSnackbar({
        open: true,
        message: "שגיאה במחיקת פריטים נרכשים",
        severity: "error"
      });
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewItem({ name: "", quantity: "" });
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.quantity.trim()) {
      setSnackbar({
        open: true,
        message: "יש להזין שם מוצר וכמות",
        severity: "warning"
      });
      return;
    }

    try {
      await dispatch(addShoppingItem(newItem)).unwrap();
      handleClose();
      setSnackbar({
        open: true,
        message: "המוצר נוסף בהצלחה",
        severity: "success"
      });
    } catch {
      setSnackbar({
        open: true,
        message: "שגיאה בהוספת המוצר",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (status === "loading") {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  }

  return (
     <Box
      sx={{
        minHeight: "115vh",
        backgroundImage: "url('/shopping-list.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    
      }}
    >
    <Box
      p={3}
      sx={{
        direction: "rtl",
    minHeight: "100vh",
    backgroundColor: "transparent",


      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ShoppingCartIcon sx={{ margin: 2, fontSize: "2.5rem" }} />
        <span style={{ fontFamily: "'Dancing Script', cursive" }}>Shopping List</span>
      </Typography>

      {error && <Alert severity="error">{typeof error === 'string' ? error : error.message || 'שגיאה לא ידועה'}</Alert>}

      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<PrintIcon />} sx={{ gap: 1, minWidth: "120px" }} onClick={handlePrint}>
          הדפס רשימה
        </Button>
        <Button variant="contained" startIcon={<EmailIcon />} sx={{ gap: 1, minWidth: "120px" }} onClick={handleSendEmail}>
          שלח במייל
        </Button>
        <Button 
          variant="contained" 
          startIcon={<DeleteSweepIcon />} 
          sx={{ gap: 1, minWidth: "120px" }} 
          onClick={handleDeleteBought}
          disabled={!shoppingList.some(item => item.bought)}
        >
          מחק נרכשים
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ gap: 1, minWidth: "120px" }} onClick={handleOpen}>
          הוסף מוצר
        </Button>
      </Box>
   
      <List
        id="shopping-list"
        sx={{
          backgroundImage: "repeating-linear-gradient(to bottom, #fff, #fff 28px, #f0f0f0 29px)",
          backgroundSize: "100% 30px",
          backgroundRepeat: "repeat-y",
          padding: 0,
          borderRadius: "8px",
          border: "1px solid #ccc",
                  maxWidth: "400px",
                  textAlign: "center",
                 margin: "0 auto"


        }}
      >
        {shoppingList.map((item, idx) => (
          <React.Fragment key={item._id}>
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: item.bought ? "#f5f5f5" : "#fff",
                '&:hover': { backgroundColor: "#f0f0f0" },
                maxWidth: 400,
               margin: "0 auto"

              }}
            >
              <Checkbox
                checked={item.bought}
                onChange={() => handleToggleBought(item)}
                sx={{ padding: 0, marginRight: 1 }}
              />
              <Typography
                sx={{
                  textDecoration: item.bought ? "line-through" : "none",
                  color: item.bought ? "#999" : "#000",
                  fontWeight: item.bought ? "normal" : "bold",
                  textAlign: "center",
                  flexGrow: 1,
                }}
              >
                {`${item.quantity} - ${item.name}`}
              </Typography>
            </ListItem>
            {idx < shoppingList.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

    <Dialog open={open} onClose={handleClose} fullWidth>
  <DialogTitle sx={{ textAlign: "right" }}>הוסף מוצר חדש</DialogTitle>

  <DialogContent
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      mt: 1,
      textAlign: "right",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    <TextField
      label="שם מוצר"
      fullWidth
      value={newItem.name}
      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
     />
    <TextField
      label="כמות"
      fullWidth
      value={newItem.quantity}
      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
 
    />
  </DialogContent>

 <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
    <Button
    variant="contained"
    onClick={handleAddItem}
    sx={{ textAlign: "right", minWidth: 100 }}
  >
    הוסף
  </Button>
  <Button
    variant="contained"
    onClick={handleClose}
    sx={{ textAlign: "right", minWidth: 100 }}
  >
    ביטול
  </Button>

</DialogActions>

</Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </Box>
  );
};


export default ShoppingListPage;

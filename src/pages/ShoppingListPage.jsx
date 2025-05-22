import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton, Checkbox, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PrintIcon from "@mui/icons-material/Print";

/**
 * עמוד רשימת קניות - יציג מוצרים חסרים או שעומדים להיגמר
 */
const ShoppingListPage = () => {
  // דוגמה לנתונים סטטיים
  const [shoppingList, setShoppingList] = React.useState([
    { name: "חלב", quantity: 1, bought: false },
    { name: "לחם", quantity: 2, bought: false },
    { name: "ביצים", quantity: 12, bought: false },
  ]);

  const handleToggleBought = (index) => {
    const newList = [...shoppingList];
    newList[index].bought = !newList[index].bought;
    setShoppingList(newList);
  };

  // פונקציה להדפסת הרשימה
  const handlePrint = () => {
    const printContent = document.getElementById("shopping-list");
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write("<html><head><title>רשימת קניות</title></head><body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: 3, textAlign: "right" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // ממורכזת
          textTransform: "uppercase", // כל אות תהיה גדולה
        }}
      >
        <ShoppingCartIcon sx={{ margin: 2, fontSize: "2.5rem" }} />
        <span style={{ fontFamily: "'Dancing Script', cursive", letterSpacing: "2px" }}>Shopping List</span>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        sx={{ marginBottom: 2 }}
        onClick={handlePrint}
      >
        הדפס רשימה
      </Button>

      <List
        id="shopping-list"
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: 1,
          direction: "rtl", // ממורזת לימין גם ברשימה
          textAlign: "right", // וודא שהטקסט בצד ימין
        }}
      >
        {shoppingList.map((item, idx) => (
          <React.Fragment key={idx}>
            <ListItem
              sx={{
                padding: "10px 20px",
                borderRadius: "6px",
                marginBottom: 1,
                backgroundColor: item.bought ? "#FFC8A4" : "#fff",
                '&:hover': { backgroundColor: item.bought ? "#FFC8A4" : "#f1f1f1" },
                display: 'flex', // חשוב להפעיל Flexbox
                justifyContent: 'space-between', // לשים רווח בין תיבת הסימון לבין המידע
              }}
            >
              <Checkbox
                checked={item.bought}
                onChange={() => handleToggleBought(idx)}
                sx={{ marginLeft: 2 }} // הזז את תיבת הסימון קצת לשמאל
              />
              <ListItemText
                primary={`${item.quantity} - ${item.name}`} // הפוך את סדר הכמות והשם
                sx={{
                  textDecoration: item.bought ? "line-through" : "none", // מכסה עם קו את המוצרים שנרכשו
                  color: item.bought ? "#000" : "#000",
                  fontWeight: item.bought ? "normal" : "bold",
                  textAlign: "right", // לוודא שהטקסט יהיה בצד ימין
                }}
              />
            </ListItem>
            {idx < shoppingList.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ShoppingListPage;

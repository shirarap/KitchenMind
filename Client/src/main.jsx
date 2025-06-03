import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store"; // זה ה-Redux Store שלך
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// יצירת נושא עם כיוון RTL ושימוש בגופן Open Sans
const theme = createTheme({
  direction: "rtl", // הגדרת כיוון RTL לכל האפליקציה
  typography: {
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: "25px",
          fontWeight: "bold",
          paddingX: 3,
          paddingY: 1,
        },
      },
      variants: [
        {
          props: { color: "primary" },
          style: {
            backgroundColor: "#5D7266", // ירוק
            color: "#fff",
            "&:hover": {
              backgroundColor: "#758F80", // כהה יותר בהובר
            },
          },
        },
        {
          props: { color: "secondary" },
          style: {
            backgroundColor: "#E53935", // אדום
            color: "#fff",
            "&:hover": {
              backgroundColor: "#D32F2F", // כהה יותר בהובר
            },
          },
        },
      ],
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);


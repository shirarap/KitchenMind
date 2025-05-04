import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * עמוד 404 - מוצג כאשר הכתובת לא קיימת
 */
const NotFound = () => {
  return (
    <Box p={3} textAlign="center">
      <Typography variant="h3">404</Typography>
      <Typography variant="h5">הדף לא נמצא</Typography>
    </Box>
  );
};

export default NotFound;

// src/pages/About.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const About = () => {
  return (
    <Box
      sx={{
        padding: '40px 20px',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
        color: '#333',
        marginTop: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        ברוכים הבאים ל-KitchenMind –
        <br />
         המקום שבו המטבח שלכם מקבל סדר חדש
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: '1.3rem',
          whiteSpace: 'pre-line',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        כאן תוכלו לנהל בקלות את מלאי מוצרי המזון בבית, <br />
        לעקוב אחרי תוקף המוצרים, לקבל התראות חכמות, <br />
        לבנות רשימת קניות מותאמת אישית –  <br />
        ואפילו ליצור מתכונים טעימים ממה שכבר יש לכם בארונות. <br />
        <br /> <br />
        חוסכים זמן, כסף, ובזבוז – והכול במקום אחד.
      </Typography>
    </Box>
  );
};

export default About;


const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const Route_User = require('./Routes/Route_User');
//const Route_Product = require('./Routes/Route_Product');

dotenv.config();

const app = express();

app.use(express.json());

//app.use('/api/user', Route_User);
//app.use('/api/product', Route_Product);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.log('MongoDB connection error:', err));

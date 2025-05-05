const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User_Route = require('../Server-node/Routes/User_Route');
const cors = require('cors');


const Product_Route=require('../Server-node/Routes/Product_Route');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', User_Route);
app.use('/product', Product_Route);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.log('MongoDB connection error:', err));


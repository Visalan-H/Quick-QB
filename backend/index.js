require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
const MDB_URL = process.env.MDB_URL;

// Import routes
const fileRoutes = require('./routes/fileRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');

// Configure express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

// Use routes
app.use('/', fileRoutes);
app.use('/suggestions', suggestionRoutes);

mongoose.connect(MDB_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        })
    })
    .catch((err) => console.log(err))
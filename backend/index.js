require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();
const MDB_URL = process.env.MDB_URL;

// Import routes
const fileRoutes = require('./routes/fileRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const authRoutes = require('./routes/authRoutes');

// Security headers
app.use(helmet());

// Configure express middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: [process.env.FRONTEND_URL_VERCEL, process.env.FRONTEND_URL_CF],
    credentials: true
}));

// Use routes
app.use('/', fileRoutes);
app.use('/auth', authRoutes);
app.use('/suggestions', suggestionRoutes);

mongoose.connect(MDB_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        })
    })
    .catch((err) => console.log(err))
require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
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

app.use(helmet());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
    origin: [process.env.FRONTEND_URL_VERCEL, process.env.FRONTEND_URL_CF],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
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
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    })
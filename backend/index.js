require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
const MDB_URL = process.env.MDB_URL;
const File = require('./models/File');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CNAME,
    api_key: process.env.CKEY,
    api_secret: process.env.CSECRET
});

// Set up CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'question-banks',
        allowed_formats: 'pdf',
        resource_type: 'raw',
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // remove extension
            return `${originalName}-${uniqueSuffix}.pdf`;
        }
    }
});

// Create multer upload middleware
const upload = multer({ storage: storage });


mongoose.connect(MDB_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log("kaekudhu");
        })
    })
    .catch((err) => console.log(err))

app.get('/all', async (req, res) => {
    try {
        const files = await File.find({});
        if (files) {
            return res.status(200).json(files)
        }
        return res.status(404).json({ msg: "No files" })

    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
})

app.post('/new', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }



        const newFile = await File.create({
            fileURL: req.file.path,
            subCode: req.body.subCode,
            contentType: req.body.contentType
        });

        return res.status(201).json(newFile);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }

})
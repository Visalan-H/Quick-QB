const express = require('express');
const router = express.Router();
const File = require('../models/File');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

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
        folder: 'question-banks/apr2026/',
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
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    }
});

// GET /all - Get all files
router.get('/all', async (req, res) => {
    try {
        const { sem = "apr2026" } = req.query;
        const files = await File.find({ sem: sem });
        if (files) {
            return res.status(200).json(files)
        }
        return res.status(404).json({ msg: "No files" })

    } catch (error) {
        return res.status(500).json({ error: 'Server error' })
    }
});

// GET /check/:subCode/:contentType - Check if document exists with content type
router.get('/check/:subCode/:contentType', async (req, res) => {
    try {
        const { sem = "apr2026" } = req.query;
        const { subCode, contentType } = req.params;
        const existingFile = await File.findOne({
            sem: sem,
            subCode: subCode.toUpperCase(),
            contentType: contentType
        });
        if (existingFile) {
            return res.status(200).json({
                exists: true,
                message: `${contentType === 'Questions' ? 'Question bank' : contentType === 'Answers' ? 'Answer key' : contentType} for ${subCode} already exists`,
                file: existingFile
            });
        } else {
            return res.status(200).json({
                exists: false,
                message: `No ${contentType === 'Questions' ? 'question bank' : contentType === 'Answers' ? 'answer key' : contentType.toLowerCase()} found for ${subCode}`
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// POST /new - Upload new file
router.post('/new', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.', error: 'No file uploaded' });
        }

        // Get username from verified auth context
        let uploadedBy = null;
        const user = await User.findOne({ email: req.user.email });
        if (user) {
            uploadedBy = user.username;
        }

        const newFile = await File.create({
            fileURL: req.file.path,
            subCode: req.body.subCode,
            contentType: req.body.contentType,
            subName: req.body.subName,
            sem: req.body.sem,
            uploadedBy
        });

        return res.status(201).json({ success: true, message: 'File uploaded successfully.', file: newFile });
    } catch (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File size exceeds the 10MB limit.' });
        }

        if (error.message === 'Only PDF files are allowed') {
            return res.status(400).json({ success: false, message: 'Only PDF files are allowed.' });
        }

        return res.status(500).json({ success: false, message: 'Unable to upload file right now. Please try again.' });
    }
});

module.exports = router;

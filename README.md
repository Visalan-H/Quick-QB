# Quick-QB 📚

<div align="center">
  <img src="frontend/public/bee.svg" alt="Quick-QB Logo" width="120" height="120">
  
  **A Community-Driven Academic Resource Platform**
  
  *Access and contribute to a comprehensive question bank and answer key repository for academic subjects*
  
  [![Made with ❤️ by vizz](https://img.shields.io/badge/Made%20with%20❤️%20by-vizz-white)](https://github.com/visalan-h)
</div>

---

## 🌟 Overview

Quick-QB is a modern, full-stack web application that revolutionizes how students access and share academic resources. Built with the MERN stack, it provides a seamless platform for uploading, searching, and downloading question banks and answer keys for various academic subjects.

### ✨ Key Features

- 🔍 **Search**: Search functionality for finding resources by subject code or name
- 📤 **Easy Upload**: Drag-and-drop PDF upload with course code auto-fill - just select the course code and the name fills automatically
- 🏫 **Comprehensive Database**: Supports 500+ course codes across multiple engineering disciplines
- 💬 **Community Feedback**: Integrated suggestion and complaint portal
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- ⚡ **Real-time Updates**: Live document existence checking during upload

## 🚀 Live Demo

Experience Quick-QB in action: [Live](https://quick-qb.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Cloud-based file storage
- **Multer** - File upload middleware

### Infrastructure
- **Vercel** - Deployment and hosting frontend
- **Render** - Hosting Backend
- **Discord Webhooks** - Real-time notifications
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Quick-QB/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── FileCard.jsx
│   │   │   ├── PDFWarningModal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── Create.jsx   # Upload page
│   │   │   ├── Home.jsx     # Dashboard
│   │   │   └── SuggestionPortal.jsx
│   │   ├── styles/          # CSS stylesheets
│   │   └── App.jsx
│   ├── public/
│   ├── unique_courses.json  # Course database
│   └── package.json
├── backend/                 # Express server
│   ├── models/             # Database schemas
│   │   ├── File.js
│   │   └── Suggestion.js
│   ├── routes/             # API endpoints
│   │   ├── fileRoutes.js
│   │   └── suggestionRoutes.js
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## 🎯 Usage Guide

1. **Search**: Use the search bar to find resources by subject code (e.g., "19CS404") or subject name
2. **Filter**: Browse through available question banks and answer keys
3. **Download**: Click "View PDF" to access the resource (security warning will appear for first-time users)

4. **Navigate**: Go to the upload page via "Upload Resource" button
5. **Course Selection**: 
   - Search by course name for auto-completion
   - Or manually enter subject code
6. **Content Type**: Choose between "Question Bank" or "Answer Key"
7. **File Upload**: 
   - Drag and drop PDF files (max 10MB)
   - Or click to browse and select
8. **Submit**: Upload your contribution to help fellow students

### Feedback System

- Access the feedback portal via the feedback button
- Submit suggestions for improvements
- Report bugs or issues
- I will get real-time Discord notifications.

## 📊 Supported Subjects

Quick-QB supports **500+ course codes** across multiple engineering disciplines:

- **Computer Science & Engineering** (19CS)
- **Artificial Intelligence** (19AI)
- **Electronics & Communication** (19EC)
- **Electrical & Electronics** (19EE)
- **Mechanical Engineering** (19ME)
- **Civil Engineering** (19CE)
- **Chemical Engineering** (19CH)
- **Biomedical Engineering** (19BM)
- **And many more...**

## 🔒 Security Features

- **File Validation**: Only PDF files under 10MB are accepted
- **PDF Warning System**: Users are warned before opening external PDFs
- **Content Type Validation**: Ensures proper categorization of uploads
- **Duplicate Prevention**: Database-level unique constraints prevent duplicate submissions

## 👨‍💻 Developer

**Made with ❤️ by [vizz](https://github.com/visalan-h)**

- Designed and developed the complete MERN stack application in **6 days**
- Integrated third-party services (Cloudinary, Discord)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all students who contribute resources to the community
- My friends for helping me build and test this.
---

<div align="center">
  <p><strong>Quick-QB</strong> -Access and contribute to a community-driven question bank for your academic subjects.</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>

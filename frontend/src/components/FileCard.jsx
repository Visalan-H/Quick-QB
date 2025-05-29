import { useState } from 'react';
import '../styles/FileCard.css';
import PDFWarningModal from './PDFWarningModal';

const FileCard = ({ file, index = 0 }) => {
    const [showWarning, setShowWarning] = useState(false);
    const animationDelay = `${index * 0.1}s`;

    const handleViewPDF = (e) => {
        e.preventDefault();

        // Check if user has dismissed warning before
        const warningDismissed = localStorage.getItem('pdfWarningDismissed');

        if (warningDismissed === 'true') {
            // Open PDF directly if warning was dismissed
            window.open(file.fileURL, '_blank', 'noopener,noreferrer');
        } else {
            // Show warning modal
            setShowWarning(true);
        }
    };

    const handleProceedToView = () => {
        window.open(file.fileURL, '_blank', 'noopener,noreferrer');
    };

    // Extract filename from URL for display
    const getFileName = (url) => {
        try {
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            // Remove Cloudinary transformations and decode
            return decodeURIComponent(fileName.split('.')[0]) + '.pdf';
        } catch {
            return `${file.subCode}_${file.contentType}.pdf`;
        }
    };

    return (
        <>
            <div className="file-card" style={{ animationDelay }}>
                <div className="file-header">
                    <h3>{file.subCode}</h3>
                    <span className="content-type">
                        {file.contentType === "Questions" ? "Question Bank" : "Answer Key"}
                    </span>
                </div>
                <div className="file-content">
                    <p className="subject-name">{file.subName}</p>
                </div>
                <div className="file-footer">
                    <button onClick={handleViewPDF} className="view-btn">
                        View PDF
                    </button>
                </div>
            </div>

            <PDFWarningModal
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                onProceed={handleProceedToView}
                fileName={getFileName(file.fileURL)}
            />
        </>
    );
};

export default FileCard;

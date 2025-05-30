import { useState } from 'react';
import '../styles/PDFWarningModal.css';

const PDFWarningModal = ({ isOpen, onClose, onProceed, fileName }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!isOpen) return null;

    const handleProceed = () => {
        if (dontShowAgain) {
            localStorage.setItem('pdfWarningDismissed', 'true');
        }
        onProceed();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="pdf-warning-overlay">
            <div className="pdf-warning-modal">
                <div className="warning-header">
                    <div className="warning-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="m12 17 .01 0" />
                        </svg>
                    </div>
                    <h2>Security Warning</h2>
                </div>

                <div className="warning-content">
                    <p className="warning-main">
                        You are about to open a PDF file that was uploaded by another user.
                    </p>

                    <div className="warning-details">
                        <h3>Important Security Notice:</h3>
                        <ul>
                            <li>PDF files can potentially contain malicious content</li>
                            <li>Only open files from sources you trust</li>
                            <li>Keep your PDF viewer software up to date</li>
                            <li>Scan files with antivirus software when in doubt</li>
                        </ul>
                    </div>

                    <div className="file-info">
                        <strong>File:</strong> {fileName}
                    </div>

                    <div className="responsibility-notice">
                        <strong>By proceeding, you acknowledge that:</strong>
                        <p>You are fully responsible for any consequences of opening this file. Quick-QB is not liable for any damage, data loss, or security breaches that may result from viewing user-uploaded content.</p>
                    </div>

                    <div className="checkbox-container">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            Don't show this warning again
                        </label>
                    </div>
                </div>

                <div className="warning-actions">
                    <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="proceed-btn" onClick={handleProceed}>
                        I Understand, Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFWarningModal;

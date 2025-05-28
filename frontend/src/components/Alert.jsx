import { useState, useEffect } from 'react';
import '../styles/Alert.css';

const Alert = ({ message, type = 'success', onClose, duration = 10000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) setTimeout(onClose, 300); // Allow time for fade-out
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300); // Allow time for fade-out
    };

    return (
        <div className={`alert ${type} ${visible ? 'show' : 'hide'}`}>
            <div className="alert-content">
                {message}
            </div>
            <button className="alert-close-btn" onClick={handleClose} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default Alert;

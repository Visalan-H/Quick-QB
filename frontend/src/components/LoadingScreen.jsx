import { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = () => {
    const [currentMessage, setCurrentMessage] = useState(0);

    const messages = [
        "Loading resources...",
        "Preparing your experience...",
        "Fetching data...",
        "Almost there..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage(prev => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="spinner-container">
                    <div className="spinner-ring"></div>
                    <div className="spinner-core"></div>
                </div>
                <div className="loading-text-container">
                    <h2 className="loading-title">QuickQB</h2>
                    <p className="loading-message" key={currentMessage}>
                        {messages[currentMessage]}
                    </p>
                </div>
            </div>
            <div className="loading-footer">
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;

import { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = () => {
    const [currentMessage, setCurrentMessage] = useState(0);

    const honestMessages = [
        "Please wait... we have a slow server 🐌",
        "Our server is taking a coffee break ☕",
        "Loading your files from our budget hosting 💸",
        "Hang tight, free hosting isn't the fastest 🚀",
        "Our hamster-powered server is working hard 🐹",
        "Patience is a virtue... especially with our server 😅"
    ];

    useEffect(() => {
        // Change message every 8 seconds
        const messageInterval = setInterval(() => {
            setCurrentMessage(prev => (prev + 1) % honestMessages.length);
        }, 8000);

        return () => {
            clearInterval(messageInterval);
        };
    }, []);

    return (
        <div className="loading-screen">
            {/* Animated background pattern */}
            <div className="loading-bg-pattern"></div>

            {/* Floating particles - viewport wide */}
            <div className="loading-particles">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            '--delay': `${i * 0.5}s`,
                            '--size': `${Math.random() * 3 + 1.5}px`
                        }}
                    ></div>
                ))}
            </div>

            {/* Study icons floating animation - viewport wide */}
            <div className="floating-icons">
                <div className="floating-icon" style={{ '--delay': '0s', '--x': '10%', '--y': '20%' }}>
                    📚
                </div>
                <div className="floating-icon" style={{ '--delay': '1s', '--x': '80%', '--y': '30%' }}>
                    🎓
                </div>
                <div className="floating-icon" style={{ '--delay': '2s', '--x': '20%', '--y': '70%' }}>
                    📝
                </div>
                <div className="floating-icon" style={{ '--delay': '3s', '--x': '70%', '--y': '80%' }}>
                    💡
                </div>
                <div className="floating-icon" style={{ '--delay': '0.5s', '--x': '90%', '--y': '60%' }}>
                    🔬
                </div>
                <div className="floating-icon" style={{ '--delay': '2.5s', '--x': '30%', '--y': '40%' }}>
                    📊
                </div>
            </div>

            {/* Main loading container */}
            <div className="loading-container">
                {/* Logo animation */}
                <div className="loading-logo">
                    <div className="logo-icon">
                        <img
                            src="/bee.svg"
                            alt="Bee Logo"
                            width="80"
                            height="80"
                            className="logo-bee"
                        />
                    </div>
                    <h1 className="loading-title">Loading Quick-QB</h1>
                    <p className="loading-subtitle">Please wait</p>
                </div>

                {/* Animated loading dots */}
                <div className="loading-dots-container">
                    <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>

                    <p className="loading-text" key={currentMessage}>
                        {honestMessages[currentMessage]}
                    </p>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="loading-footer">
                <p>Made with <span className="heart">❤️</span> by vizz</p>
            </div>
        </div>
    );
};

export default LoadingScreen;

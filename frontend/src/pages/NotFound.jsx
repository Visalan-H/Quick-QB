import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <div className="glitch-wrapper">
                    <div className="glitch" data-text="404">404</div>
                </div>

                <h2 className="notfound-title">Page Not Found</h2>
                <p className="notfound-description">
                    Oops! The page you're looking for seems to have vanished into the digital void.
                </p>

                <div className="floating-elements">
                    <span className="float-item">?</span>
                    <span className="float-item">!</span>
                    <span className="float-item">@</span>
                    <span className="float-item">#</span>
                    <span className="float-item">%</span>
                </div>

                <div className="notfound-actions">
                    <Link to="/" className="home-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className="binary-rain">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="binary" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}>
                            {Math.random() > 0.5 ? '1' : '0'}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFound;

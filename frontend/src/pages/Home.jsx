import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Remove Fuse import
import LoadingScreen from '../components/LoadingScreen';
import FileCard from '../components/FileCard';
import '../styles/Home.css';

const Home = () => {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // Remove fuse state    // Add cursor trail state
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showCursorTrail, setShowCursorTrail] = useState(true);
    const cursorRef = useRef(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                } const data = await response.json();
                setFiles(data);
                setFilteredFiles(data);

                // Remove fuzzy search initialization

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);    // Add cursor trail effect
    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let bounceTimeout;

        const handleMouseMove = (e) => {
            // Set position directly using top and left instead of transform
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;

                // Add bounce effect when mouse moves quickly
                const deltaX = Math.abs(e.clientX - lastX);
                const deltaY = Math.abs(e.clientY - lastY);
                const speed = deltaX + deltaY;

                if (speed > 50) {
                    cursorRef.current.classList.add('bounce');
                    clearTimeout(bounceTimeout);
                    bounceTimeout = setTimeout(() => {
                        if (cursorRef.current) {
                            cursorRef.current.classList.remove('bounce');
                        }
                    }, 300);
                }

                lastX = e.clientX;
                lastY = e.clientY;
            }
        };

        const handleClick = () => {
            // Add bounce effect on click
            if (cursorRef.current) {
                cursorRef.current.classList.add('bounce');
                clearTimeout(bounceTimeout);
                bounceTimeout = setTimeout(() => {
                    if (cursorRef.current) {
                        cursorRef.current.classList.remove('bounce');
                    }
                }, 300);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            clearTimeout(bounceTimeout);
        };
    }, []);

    // Handle search functionality - replace fuzzy search with simple filtering
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredFiles(files);
            return;
        }        // Simple filtering instead of fuzzy search
        const filtered = files.filter(file =>
            file.subCode.toLowerCase().includes(query) ||
            file.contentType.toLowerCase().includes(query) ||
            (file.subName && file.subName.toLowerCase().includes(query))
        );

        setFilteredFiles(filtered);
    };

    if (loading) return <LoadingScreen />;
    if (error) return <div className="error">Error: {error}</div>;    return (
        <div className="home-container">
            {showCursorTrail && <div className="cursor-trail" ref={cursorRef}></div>}

            {/* Cursor Trail Toggle - Top Left */}
            <button 
                className="cursor-toggle-button"
                onClick={() => setShowCursorTrail(!showCursorTrail)}
                title={showCursorTrail ? "Hide cursor trail" : "Show cursor trail"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showCursorTrail ? (
                        // Eye slash icon (hidden)
                        <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                    ) : (
                        // Eye icon (visible)
                        <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </>
                    )}
                </svg>
            </button>

            {/* Suggestion/Complaint Button - Top Right */}
            <Link to="/suggestions" className="suggestion-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Feedback
            </Link>            <section className="hero-section">
                <div className="hero-content">
                    <h1>Quick-QB</h1>
                    <p className="hero-subtitle">Access and contribute to a community-driven question bank for your academic subjects.</p>

                    {/* Made with love attribution */}
                    <div className="hero-attribution">
                        <p>made with <span className="heart">❤️</span> by vizz</p>
                    </div>

                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>                            <input
                                type="text"
                                placeholder="Search by subject code or name"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button className="clear-search" onClick={() => { setSearchQuery(''); setFilteredFiles(files); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <Link to="/create" className="cta-button">Upload Resource</Link>
                    </div>
                </div>
            </section>

            {filteredFiles.length === 0 ? (
                <div className="no-files">
                    {searchQuery ? (
                        <>
                            <div className="empty-state-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <p>No results found for "{searchQuery}"</p>
                            <button className="reset-search" onClick={() => { setSearchQuery(''); setFilteredFiles(files); }}>
                                Clear Search
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="empty-state-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                            </div>
                            <p>No study materials available yet.</p>
                            <Link to="/create" className="empty-state-btn">Upload Your First Resource</Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="files-section">                    <div className="section-header">
                    <h2 className="section-title">
                        {searchQuery
                            ? `Search Results (${filteredFiles.length})`
                            : 'Available Resources'}
                    </h2>
                    {searchQuery && (
                        <button className="reset-search" onClick={() => { setSearchQuery(''); setFilteredFiles(files); }}>
                            Reset
                        </button>
                    )}
                </div>                    <div className="file-grid">
                        {filteredFiles.map((file, index) => (
                            <FileCard key={file._id} file={file} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

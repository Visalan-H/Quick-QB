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

    // Archive dropdown state
    const [showArchiveDropdown, setShowArchiveDropdown] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState('dec2025');
    const archiveDropdownRef = useRef(null);

    const archiveOptions = [
        { value: 'dec2025', label: 'Dec 2025' },
        { value: 'may2025', label: 'May 2025' }
    ];

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const url = selectedArchive === 'may2025'
                    ? `${import.meta.env.VITE_BASE_URL}/all?sem=may2025`
                    : `${import.meta.env.VITE_BASE_URL}/all`;

                const response = await fetch(url);
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
    }, [selectedArchive]);

    // Handle clicks outside archive dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (archiveDropdownRef.current && !archiveDropdownRef.current.contains(event.target)) {
                setShowArchiveDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
    if (error) return <div className="error">Error: {error}</div>; return (
        <div className="home-container">

            {/* Archive Dropdown - Top Left */}
            <div className='archive-button'>
                <div className="archive-dropdown-container" ref={archiveDropdownRef}>
                    <button
                        className="archive-toggle-button"
                        onClick={() => setShowArchiveDropdown(!showArchiveDropdown)}
                        title="Select Archive"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                            <rect x="1" y="3" width="22" height="5"></rect>
                            <polyline points="9 14 12 17 15 14"></polyline>
                            <line x1="12" y1="11" x2="12" y2="17"></line>
                        </svg>
                        <svg className={`archive-chevron ${showArchiveDropdown ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {showArchiveDropdown && (
                        <div className="archive-dropdown">
                            {archiveOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`archive-option ${selectedArchive === option.value ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedArchive(option.value);
                                        setShowArchiveDropdown(false);
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>  
            </div>

            {/* Suggestion/Complaint Button - Top Right */}
            <Link to="/suggestions" className="suggestion-button" title='Provide feedback'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
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
                                autoFocus
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
                        {selectedArchive === "dec2025" && <Link to="/create" className="cta-button">Upload Resource</Link>}
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

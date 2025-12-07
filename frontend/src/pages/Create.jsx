import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import '../styles/Create.css';
import '../styles/help-text.css';
import coursesData from '../../unique_courses.json';

const Create = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subCode: '',
        contentType: 'Questions',
        file: null
    }); const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(8);
    const [isDragging, setIsDragging] = useState(false);
    const [subName, setSubName] = useState('');
    const [existenceCheck, setExistenceCheck] = useState(null);// Course search states
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);
    const searchInputRef = useRef(null);    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setSelectedIndex(-1);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if document exists
    const checkDocumentExists = async (subCode, contentType) => {
        if (!subCode || subCode.length < 6 || !contentType) {
            setExistenceCheck(null);
            return;
        }

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/check/${subCode}/${contentType}`);
            setExistenceCheck(data);
        } catch (error) {
            console.error('Error checking document existence:', error);
            setExistenceCheck(null);
        }
    };

    // Debounced version of checkDocumentExists
    const debouncedCheckDocumentExists = useCallback((subCode, contentType) => {
        // Clear previous timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Set new timeout
        debounceRef.current = setTimeout(() => {
            checkDocumentExists(subCode, contentType);
        }, 500); // 500ms delay
    }, []);    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    // Countdown timer for redirect
    useEffect(() => {
        let timer;
        if (showSuccess && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (showSuccess && countdown === 0) {
            navigate('/');
        }
        return () => clearTimeout(timer);
    }, [showSuccess, countdown, navigate]); const handleChange = (e) => {
        const { name, value } = e.target;

        // Capitalize subject code if that's what changed
        if (name === 'subCode') {
            const upperCaseValue = value.toUpperCase();

            // Set the form data with uppercase value
            setFormData(prev => ({
                ...prev,
                [name]: upperCaseValue
            }));            // Check if document exists (debounced)
            debouncedCheckDocumentExists(upperCaseValue, formData.contentType);

            // Look up the course name in coursesData if a code is entered directly
            if (upperCaseValue && coursesData[upperCaseValue]) {
                const courseName = coursesData[upperCaseValue];
                setSubName(courseName);
                setSearchTerm(courseName);
            } else if (upperCaseValue) {
                // Clear subject name if code doesn't exist
                setSubName('');
                setSearchTerm('');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // If content type changed, re-check document existence
            if (name === 'contentType' && formData.subCode && formData.subCode.length >= 6) {
                debouncedCheckDocumentExists(formData.subCode, value);
            }
        }
    };    // Handle course search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedIndex(-1); // Reset selection when typing

        if (value.length > 2) {
            // Search through course names
            const results = Object.entries(coursesData)
                .filter(([, name]) =>
                    name.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 10); // Limit to 10 results

            setSearchResults(results);
            setShowDropdown(results.length > 0);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };    // Handle course selection
    const handleCourseSelect = (code, name) => {
        const upperCaseCode = code.toUpperCase();
        setFormData(prev => ({
            ...prev,
            subCode: upperCaseCode
        }));
        setSearchTerm(name);
        setSubName(name);
        setShowDropdown(false);
        setSelectedIndex(-1);

        // Check if document exists for the selected course (debounced)
        debouncedCheckDocumentExists(upperCaseCode, formData.contentType);
    };

    // Handle keyboard navigation in search dropdown
    const handleSearchKeyDown = (e) => {
        if (!showDropdown || searchResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < searchResults.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                    const [code, name] = searchResults[selectedIndex];
                    handleCourseSelect(code, name);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowDropdown(false);
                setSelectedIndex(-1);
                searchInputRef.current?.blur();
                break;
        }
    };

    // Handle custom subject name input
    const handleSubNameChange = (e) => {
        setSubName(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check if it's a PDF
            if (selectedFile.type !== 'application/pdf') {
                setError('Please select a PDF file');
                e.target.value = '';
                return;
            }

            // Check file size (10MB limit)
            const fileSizeInMB = selectedFile.size / 1024 / 1024;
            if (fileSizeInMB > 10) {
                setError('File size exceeds 10MB limit');
                e.target.value = '';
                return;
            } setFormData(prev => ({
                ...prev,
                file: selectedFile
            }));
            // Don't override the subject name if it's already set from course selection

            setError(null);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }; const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const droppedFile = files[0];

            // Check if it's a PDF
            if (droppedFile.type !== 'application/pdf') {
                setError('Please upload a PDF file');
                return;
            }

            // Check file size (10MB limit)
            const fileSizeInMB = droppedFile.size / 1024 / 1024;
            if (fileSizeInMB > 10) {
                setError('File size exceeds 10MB limit');
                return;
            } setFormData(prev => ({
                ...prev,
                file: droppedFile
            }));
            // Don't override the subject name if it's already set from course selection

            setError(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleFileAreaClick = () => {
        document.getElementById('file').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsLoading(true);
        setError(null);

        if (!formData.file || !formData.subCode || !formData.contentType || !subName) {
            setError('Please fill all required fields and select a course');
            setIsLoading(false);
            return;
        }

        try {
            const formDataObj = new FormData();
            formDataObj.append('file', formData.file);
            formDataObj.append('subCode', formData.subCode);
            formDataObj.append('contentType', formData.contentType);
            formDataObj.append('subName', subName);
            formDataObj.append('sem', "dec2025");

            await axios.post(`${import.meta.env.VITE_BASE_URL}/new`, formDataObj, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });            // Show success message with thank you note
            setShowSuccess(true);
            setCountdown(8); // Reset countdown

            // Reset form
            setFormData({
                subCode: '',
                contentType: 'Questions', file: null
            });
            setSubName('');
            setSearchTerm('');
            setSelectedIndex(-1);
            setShowDropdown(false);

            // Note: Navigation now handled by countdown useEffect

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-container">
            {showSuccess && (
                <Alert
                    message={
                        <div className="success-message-container">
                            <div className="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3>Upload Successful!</h3>
                            <p>Your <strong>{formData.contentType === 'Questions' ? 'question bank' : 'answer key'}</strong> for <strong>{formData.subCode}</strong> has been successfully uploaded!</p>
                            <p>Thank you for contributing to our growing repository and helping fellow students succeed. Your contribution makes a real difference!</p>
                            {/* <div className="success-stats">
                                <span>📊 Join thousands of students who have benefited from shared resources</span>
                            </div> */}
                            <div className="success-actions">
                                <button
                                    onClick={() => {
                                        setShowSuccess(false);
                                        setCountdown(10);
                                    }}
                                    className="stay-button"
                                >
                                    Upload Another
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="home-button"
                                >
                                    Go Home Now
                                </button>
                            </div>
                            <p className="redirect-note">Auto-redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
                        </div>
                    }
                    type="success"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            {/* Utility Links with headers - with bigger icons */}
            <div className="utility-links-container">
                <div className="utility-link-wrapper right">
                    <h3 className="utility-link-header">File size &gt; 10MB?</h3>
                    <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" className="utility-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Compress PDF
                    </a>
                </div>

                <div className="utility-link-wrapper left">
                    <h3 className="utility-link-header">Don't have it as a pdf?</h3>
                    <a href="https://www.ilovepdf.com/word_to_pdf" target="_blank" rel="noopener noreferrer" className="utility-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        DOC to PDF
                    </a>
                </div>
            </div>

            <header>
                <h1>Upload Study Resource</h1>
                <Link to="/" className="back-btn">Back to Home</Link>
            </header>

            <form onSubmit={handleSubmit} className="upload-form">                <div className="form-group">                    <label htmlFor="courseSearch">Search Course by Name</label>
                <input
                    type="text"
                    id="courseSearch"
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Type course name to search..."
                    autoComplete="off"
                />                    {/* Course search dropdown */}
                {showDropdown && (
                    <div className="search-results-dropdown" ref={dropdownRef}>
                        {searchResults.length > 0 ? (
                            searchResults.map(([code, name], index) => (
                                <div
                                    key={code}
                                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => handleCourseSelect(code, name)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {name} ({code})
                                </div>
                            ))
                        ) : (
                            <div className="no-results">No results found</div>
                        )}
                    </div>
                )}
            </div>                <div className="form-group">
                    <label htmlFor="subCode">Subject Code <span className="required">*</span></label>
                    <input
                        type="text"
                        id="subCode"
                        name="subCode"
                        value={formData.subCode}
                        onChange={handleChange}
                        placeholder="E.g., 19CS404, 19AI505, 19EE404"
                        required
                    />

                    {/* Document existence check display */}
                    {existenceCheck && (
                        <div className={`existence-check ${existenceCheck.exists ? 'exists' : 'not-exists'}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {existenceCheck.exists ? (
                                    <>
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </>
                                ) : (
                                    <>
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="m9 12 2 2 4-4"></path>
                                    </>
                                )}
                            </svg>
                            <span>{existenceCheck.message}</span>
                        </div>
                    )}
                </div>

                {/* Custom subject name field - show only when subject code is entered but not found in database */}
                {formData.subCode && !coursesData[formData.subCode] && (
                    <div className="form-group">
                        <label htmlFor="customSubName">Subject Name <span className="required">*</span></label>
                        <input
                            type="text"
                            id="customSubName"
                            value={subName}
                            onChange={handleSubNameChange}
                            placeholder="Enter the subject name for this code"
                            required
                        />
                        <small className="help-text">This code isn't in our database. Please enter the subject name.</small>
                    </div>
                )}<div className="form-group">
                    <label>Content Type <span className="required">*</span></label>
                    <div className="radio-group">
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="questions"
                                name="contentType"
                                value="Questions"
                                checked={formData.contentType === "Questions"}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="questions" className="radio-label">
                                <span className="radio-text">Question Bank</span>
                            </label>
                        </div>
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="answers"
                                name="contentType"
                                value="Answers"
                                checked={formData.contentType === "Answers"}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="answers" className="radio-label">
                                <span className="radio-text">Answer Key</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="file">PDF File <span className="required">*</span></label>                    <div
                        className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleFileAreaClick}
                    >                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            accept=".pdf"
                            style={{ display: 'none' }}
                        /><div className="upload-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>                        <p className="upload-text">
                            {isDragging
                                ? 'Release to upload PDF'
                                : formData.file
                                    ? 'Selected file:'
                                    : 'Drag and drop your PDF file here, or click to select'}
                        </p>                        {formData.file && (
                            <div className="file-info">
                                <p className="file-name">{formData.file.name}</p>
                            </div>
                        )}
                    </div>
                </div>        {error && <div className="error-message">{error}</div>}                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default Create;

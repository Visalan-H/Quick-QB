import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/SuggestionPortal.css';

const SuggestionPortal = () => {
    const [formData, setFormData] = useState({
        type: 'suggestion',
        title: '',
        description: '',
        userEmail: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/suggestions`, formData);

            setSubmitStatus({ type: 'success', message: data.msg });
            // Reset form
            setFormData({
                type: 'suggestion',
                title: '',
                description: '',
                userEmail: ''
            });
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Failed to submit feedback';
            setSubmitStatus({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="suggestion-portal">
            <div className="portal-header">
                <Link to="/" className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg>
                    Back to Home
                </Link>
                <h1>Feedback Portal</h1>
                <p>Help us improve Quick-QB by sharing your suggestions or reporting issues</p>
            </div>

            <div className="portal-content">
                <form onSubmit={handleSubmit} className="suggestion-form">
                    <div className="form-group">
                        <label htmlFor="type">Feedback Type *</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="suggestion">💡 Suggestion</option>
                            <option value="complaint">⚠️ Complaint/Issue</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Brief summary of your feedback"
                            maxLength="100"
                            required
                        />
                        <small className="char-count">{formData.title.length}/100</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Please provide detailed information about your suggestion or issue..."
                            rows="6"
                            maxLength="1000"
                            required
                        />
                        <small className="char-count">{formData.description.length}/1000</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="userEmail">Email (Optional)</label>
                        <input
                            type="email"
                            id="userEmail"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                        />
                        <small>We'll only use this to follow up if needed</small>
                    </div>

                    {submitStatus && (
                        <div className={`status-message ${submitStatus.type}`}>
                            {submitStatus.type === 'success' ? '✅' : '❌'} {submitStatus.message}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner"></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </div>
                </form>

                <div className="portal-info">
                    <h3>How we handle your feedback</h3>
                    <div className="info-cards">
                        <div className="info-card">
                            <div className="card-icon">💡</div>
                            <h4>Suggestions</h4>
                            <p>Your ideas help us improve features and add new functionality to make Quick-QB better for everyone.</p>
                        </div>
                        <div className="info-card">
                            <div className="card-icon">⚠️</div>
                            <h4>Issues</h4>
                            <p>Report bugs, errors, or problems you encounter. We prioritize fixing issues to ensure a smooth experience.</p>
                        </div>
                        <div className="info-card">
                            <div className="card-icon">🔒</div>
                            <h4>Privacy</h4>
                            <p>Your feedback is confidential. Email addresses are only used for follow-up communication if needed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionPortal;
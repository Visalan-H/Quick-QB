import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Create.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: otp+password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_MAIL_SERVICE_URL}/send-otp`,
                { email: formData.email, type: 'forgot-password' }
            );

            if (data.success) {
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Verify OTP with backend
            const otpVerification = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
                { email: formData.email, otp: formData.otp }
            );

            if (!otpVerification.data.success) {
                setError(otpVerification.data.message || 'Invalid OTP');
                setIsLoading(false);
                return;
            }

            // Reset password with backend
            const { data } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/auth/reset-password`,
                {
                    email: formData.email,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                },
                { withCredentials: true }
            );

            if (data.success) {
                navigate('/login');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-container">
            <header className="auth-header">
                <h1>Reset Password</h1>
                <Link to="/login" className="back-btn">← Back</Link>
            </header>

            <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="upload-form">
                {step === 1 ? (
                    <div className="form-group">
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your registered email"
                            required
                            autoFocus
                        />
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="otp">OTP <span className="required">*</span></label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter OTP sent to your email"
                                required
                                autoFocus
                            />
                            <small style={{ marginTop: '0.5rem', color: 'var(--gray-400)' }}>
                                Check your email for the verification code
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                required
                            />
                        </div>
                    </>
                )}

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <Spinner /> : step === 1 ? 'Send OTP' : 'Reset Password'}
                </button>

                {step === 2 && (
                    <p className="auth-center-link">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' }); }}
                            className="link-button"
                        >
                            ← Use different email
                        </button>
                    </p>
                )}

                <p className="auth-center-link">
                    Remember your password? <Link to="/login" className="link-accent">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Create.css';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: username+email, 2: otp+passwords
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_MAIL_SERVICE_URL}/send-otp`,
                { email: formData.email, type: 'register' }
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
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

            // Register user with backend
            const { data } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/auth/register`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                },
                { withCredentials: true }
            );

            if (data.success) {
                navigate('/create');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-container">
            <header className="auth-header">
                <h1>Sign Up</h1>
                <Link to="/" className="back-btn">← Back</Link>
            </header>

            <form onSubmit={step === 1 ? handleVerifyEmail : handleRegister} className="upload-form">
                <div className="form-group">
                    <label htmlFor="username">Username <span className="required">*</span></label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        disabled={step === 2}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={step === 2}
                        required
                    />
                </div>

                {step === 2 && (
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
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
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
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    </>
                )}

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <Spinner /> : step === 1 ? 'Verify Email' : 'Sign Up'}
                </button>

                {step === 1 ? (
                    <p className="auth-center-link">
                        Already have an account? <Link to="/login" className="link-accent">Login</Link>
                    </p>
                ) : (
                    <p className="auth-center-link">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); }}
                            className="link-button"
                        >
                            ← Change email
                        </button>
                    </p>
                )}
            </form>
        </div>
    );
};

export default Register;

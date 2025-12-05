import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();

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
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: Number(formData.otp),
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                })
            });
            const data = await res.json();

            if (data.success) {
                navigate('/login');
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong');
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
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray-400)' }}>
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' }); }}
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: 0, font: 'inherit' }}
                            className="underline-animated"
                        >
                            ← Use different email
                        </button>
                    </p>
                )}

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray-400)' }}>
                    Remember your password? <Link to="/login" className="underline-animated" style={{ color: 'var(--color-accent)' }}>Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;

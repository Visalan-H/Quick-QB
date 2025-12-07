import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Create.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/auth/login`,
                formData,
                { withCredentials: true }
            );

            if (data.success) {
                navigate('/create');
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
                <h1>Login</h1>
                <Link to="/" className="back-btn">← Back</Link>
            </header>

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'Login'}
                </button>

                <div className="auth-links">
                    <Link to="/forgot-password" className="link-accent">Forgot password?</Link>
                    <Link to="/register" className="link-accent">Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;

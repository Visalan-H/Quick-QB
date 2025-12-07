import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/auth/check`,
                    { withCredentials: true }
                );
                setIsAuth(data.success);
            } catch {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <LoadingScreen />;
    if (!isAuth) return <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;

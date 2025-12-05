import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/check`, {
                    credentials: 'include'
                });
                const data = await res.json();
                setIsAuth(data.success);
            } catch {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <div className="loading">Loading...</div>;
    if (!isAuth) return <Navigate to="/login" replace />;
    return children;
};

export default ProtectedRoute;

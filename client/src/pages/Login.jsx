import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-backdrop">
            <div className="login-card">

                <div className="login-icon-wrapper">
                    <div className="login-icon-box">
                        <Wallet className="login-wallet-icon" size={30} />
                    </div>
                </div>

                <h1 className="login-title">
                    Welcome Back
                </h1>

                <p className="login-subtitle">
                    Sign in to continue to SmartSpend
                </p>

                <form onSubmit={handleSubmit} className="login-form">

                    <div className="login-field">
                        <label className="login-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="login-input"
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">
                            Password
                        </label>

                        <div className="login-password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="login-input login-password-input"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-eye-btn"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="login-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-submit-btn"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

                <p className="login-footer-text">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="login-link"
                    >
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
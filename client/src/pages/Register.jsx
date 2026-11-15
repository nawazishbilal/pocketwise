import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet } from 'lucide-react';
import './Register.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must contain at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-backdrop">
            <div className="register-card">

                <div className="register-icon-wrapper">
                    <div className="register-icon-box">
                        <Wallet className="register-wallet-icon" size={30} />
                    </div>
                </div>

                <h1 className="register-title">
                    Create Account
                </h1>

                <p className="register-subtitle">
                    Start managing your finances smarter
                </p>

                <form onSubmit={handleSubmit} className="register-form">

                    <div className="register-field">
                        <label className="register-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="register-input"
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="register-input"
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="register-input"
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            className="register-input"
                        />
                    </div>

                    {error && (
                        <p className="register-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="register-submit-btn"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                </form>

                <p className="register-footer-text">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="register-link"
                    >
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;
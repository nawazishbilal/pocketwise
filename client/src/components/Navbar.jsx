import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

import { Wallet, LayoutDashboard, Receipt, Target, Settings, LogOut } from 'lucide-react';

import './Navbar.css';

export default function Navbar() {

    const [isVisible, setIsVisible] = useState(true);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', path: '/transactions', icon: Receipt },
        { name: 'Budgets', path: '/budgets', icon: Wallet },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'Settings', path: '/settings', icon: Settings }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className={`navbar ${isVisible ? 'show' : 'hide'}`}>
                <div className="nav-branding">
                    <h1 id="brand-name">pocket<span id="wise">wise</span></h1>
                    <p id="brand-tagline">YOUR FINANCE TRACKER</p>
                </div>

                {/* <button id="close-nav" onClick={() => setIsVisible(!isVisible)} label={isVisible ? "Hide menu" : "Show menu"}>{isVisible ? '✕ Close' : '☰ Menu'}</button> */}

                <p id="nav-heading">WORKSPACE</p>

                <nav className="nav-routes">
                    {links.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={name} to={path} className={({ isActive }) =>
                                isActive ? 'nav-item active' : 'nav-item'
                            }
                        >
                            <Icon size={19} />
                            <span>{name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className='account-box'>
                    <div className="nav-account">
                        <div className="user-icon">
                            <p>NB</p>
                        </div>
                        <div className="user-details">
                            <p id="user-name">Nawazish Bilal</p>
                            <p id="user-email">nawazish@example.com</p>
                        </div>
                        <button onClick={handleLogout} id="logout-btn">
                            <LogOut size={19} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
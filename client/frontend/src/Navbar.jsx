import { useState } from 'react';

export default function Navbar() {

    const [isVisible, setIsVisible] = useState(true);

    return (
        <>
            <div className={`navbar ${isVisible ? 'show' : 'hide'}`}>
                <div className="nav-branding">
                    <h1 id="brand-name">pocket<span id="wise">wise</span></h1>
                    <p id="brand-tagline">YOUR FINANCE TRACKER</p>
                </div>

                <button id="close-nav" onClick={() => setIsVisible(!isVisible)} label={isVisible ? "Hide menu" : "Show menu"}>{isVisible ? '✕ Close' : '☰ Menu'}</button>

                <p id="nav-heading">WORKSPACE</p>

                <div className="nav-routes">
                    <p id="dashboard" style={{backgroundColor:'#fce8e4'}}>Dashboard</p>
                    <p id="transactions">Transactions</p>
                    <p id="budgets">Budgets</p>
                    <p id="goals">Savings Goals</p>
                    <p id="insights">Insights</p>
                </div>

                <div className="nav-account">
                    <div className="user-icon">
                        <p>NB</p>
                    </div>
                    <div className="user-details">
                        <p id="user-name">Nawazish Bilal</p>
                        <p id="user-email">nawazish@example.com</p>
                    </div>
                </div>
            </div>
        </>
    )
}
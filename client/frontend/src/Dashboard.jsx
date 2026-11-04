import "./Dashboard.css"
import DashboardCard from "./DashboardCards"

export default function Dashboard() {
    const currMonth = new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="container">
            <div className="left-space"></div>
            <div className="main-content">
                <div className="header">
                    <div className="head-greet">
                        <h1 id="greeting">Welcome back, Nawazish!</h1>
                        <p id="greet-subtitle">Here's your money at a glance.</p>
                    </div>

                    <p id="cur-month">{currMonth}</p>

                    <button id="add-trans">+ Add Transaction</button>
                </div>
                <div className="main-cards">
                    <DashboardCard key={1} num="12000" type="Balance" color="#A53D36" />
                    <DashboardCard key={2} num="12000" type="Income" color="green" />
                    <DashboardCard key={3} num="12000" type="Expense" color="red" />
                </div>
            </div>
        </div>
    )
}
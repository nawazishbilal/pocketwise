import Navbar from "../components/Navbar";
import "./DashboardLayout.css"

export default function DashboardLayout({ children }) {
    return (
        <>
            <div className="dashboard-container">
                <Navbar />

                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </>
    )
}
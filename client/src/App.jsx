import Navbar from "./Navbar"
import Dashboard from "./Dashboard"
import DashboardCard from "./DashboardCards"

import './index.css'

export default function App() {
  return (
    <>
      <Navbar />
      <Dashboard />
      {/* <DashboardCard key="expense" num={12000} type="Balance" /> */}
    </>
  )
}
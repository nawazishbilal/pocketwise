import { ChevronDown } from "lucide-react";
import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import './Analytics.css'

export default function Analytics() {

    const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));

    return (
        <DashboardLayout>
            <div className="header">
                <div>
                    <h1 className="header-title">
                        Analytics
                    </h1>

                    <p className="header-subtitle">
                        View your spending trends and patterns.
                    </p>
                </div>

                <button className="period-selector">
                    <p className="monthyear">{monthYear}</p>
                    <ChevronDown size={17} className="down-arrow"/>
                </button>
            </div>

            <div className='main'>
                <p>This feature will be rolling out soon. Stay Tuned!</p>
            </div>
        </DashboardLayout>
    )
}
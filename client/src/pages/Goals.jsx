import { Plus } from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'

import './Goals.css'

export default function Goals() {
    return (
        <DashboardLayout>
            <div className="header">
                <div>
                    <h1 className="header-title">
                        Goals
                    </h1>

                    <p className="header-subtitle">
                        Set and manage your goals.
                    </p>
                </div>

                <button
                    onClick={() => {window.alert("Feature coming soon!")}}
                    className="add-btn"
                >
                    <Plus size={20} />
                    Create Goal
                </button>
            </div>

            <div className='main'>
                <p>This feature will be rolling out soon. Stay Tuned!</p>
            </div>
        </DashboardLayout>
    )
}

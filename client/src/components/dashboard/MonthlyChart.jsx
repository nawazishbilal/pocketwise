import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import './MonthlyChart.css';

const MonthlyChart = ({ data }) => {
    return (
        <div className="monthly-chart-card">

            <h2 className="monthly-chart-title">
                Financial Overview
            </h2>

            <div className="monthly-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                        />

                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                        />

                        <YAxis
                            stroke="#9CA3AF"
                            tickFormatter={(value) => `₹${value}`}
                        />

                        <Tooltip
                            formatter={(value) =>
                                `₹${Number(value).toLocaleString('en-IN')}`
                            }
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px'
                            }}
                        />

                        <Legend />

                        <Bar
                            dataKey="Income"
                            name="Income"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                        />

                        <Bar
                            dataKey="Expense"
                            name="Expense"
                            fill="#F87171"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default MonthlyChart;
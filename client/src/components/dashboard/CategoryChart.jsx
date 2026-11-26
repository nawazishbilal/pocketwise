import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './CategoryChart.css';

const COLORS = [
    '#10B981',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4'
];

const CategoryChart = ({ data }) => {
    return (
        <div className="category-chart-card">

            <h2 className="category-chart-title">
                Expense Breakdown
            </h2>

            {data.length === 0 ? (
                <div className="category-chart-empty">
                    No expense data available
                </div>
            ) : (
                <div className="category-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="45%"
                                outerRadius={85}
                                paddingAngle={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={entry.category}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                            />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    );
};

export default CategoryChart;
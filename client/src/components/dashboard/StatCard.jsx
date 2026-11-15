import './StatCard.css';

const StatCard = ({ title, amount, icon: Icon, color, subtitle }) => {
    return (
        <div className="stat-card">

            <div className="stat-header">
                <p className="stat-title">{title}</p>

                <div className={`stat-icon-container ${color}`}>
                    <Icon size={20} />
                </div>
            </div>

            <h2 className="stat-amount">
                ₹{amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </h2>

            <p className="stat-subtitle">
                {subtitle}
            </p>

        </div>
    );
};

export default StatCard;
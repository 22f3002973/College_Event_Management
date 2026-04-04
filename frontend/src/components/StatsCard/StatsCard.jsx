import "./StatsCard.css";

const StatsCard = ({ title, count }) => {
  return (
    <div className="stats-card">
      <h4>{title}</h4>
      <h2>{count}</h2>
    </div>
  );
};

export default StatsCard;

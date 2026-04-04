import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Loading state
  if (!data) return <p style={{ padding: "20px" }}>Loading...</p>;

  // Pie Chart Data
  const pieData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [data.approved, data.pending, data.rejected],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ["Events", "Registrations", "Feedback"],
    datasets: [
      {
        label: "Counts",
        data: [
          data.totalEvents,
          data.totalRegistrations,
          data.totalFeedback,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analytics Dashboard 📊</h2>

      {/* ================= STATS ================= */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{data.totalEvents}</p>
        </div>

        <div className="stat-card">
          <h3>Registrations</h3>
          <p>{data.totalRegistrations}</p>
        </div>

        <div className="stat-card">
          <h3>Feedback</h3>
          <p>{data.totalFeedback}</p>
        </div>
      </div>

      {/* ================= INSIGHTS ================= */}
      <h3>Insights 🔍</h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div className="stat-card">
          <h4>🏆 Top Event</h4>
          <p>
            {data.topEvent
              ? `${data.topEvent.title} (${data.topEvent.registrations})`
              : "N/A"}
          </p>
        </div>

        <div className="stat-card">
          <h4>👤 Most Active User</h4>
          <p>
            {data.topUser
              ? `${data.topUser.studentId} (${data.topUser.registrations})`
              : "N/A"}
          </p>
        </div>

        <div className="stat-card">
          <h4>⭐ Highest Rated Event</h4>
          <p>
            {data.highestRatedEvent
              ? `${data.highestRatedEvent.title} (${data.highestRatedEvent.rating})`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {/* Pie Chart */}
        <div style={{ width: "300px", height: "300px" }}>
          <h4 style={{ textAlign: "center" }}>Event Status</h4>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        {/* Bar Chart */}
        <div style={{ width: "400px", height: "300px" }}>
          <h4 style={{ textAlign: "center" }}>Overall Data</h4>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* ================= RATING ================= */}
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        ⭐ Average Rating: {data.avgRating} / 5
      </p>
    </div>
  );
};

export default AnalyticsDashboard;
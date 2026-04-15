import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/analytics");
      setData(res.data);
    } catch (err) {
      console.error("Analytics Error:", err.response?.data || err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading analytics...</p>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Failed to load analytics</p>
      </>
    );
  }


  const totalEvents = data.totalEvents || 0;
  const totalRegistrations = data.totalRegistrations || 0;
  const totalFeedback = data.totalFeedback || 0;

  const approved = data.approved || 0;
  const pending = data.pending || 0;
  const rejected = data.rejected || 0;

  const avgRating = data.avgRating || 0;

  const pieData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: ["Events", "Registrations", "Feedback"],
    datasets: [
      {
        label: "Counts",
        data: [totalEvents, totalRegistrations, totalFeedback],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Analytics Dashboard 📊</h2>

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
            <p>{totalEvents}</p>
          </div>

          <div className="stat-card">
            <h3>Registrations</h3>
            <p>{totalRegistrations}</p>
          </div>

          <div className="stat-card">
            <h3>Feedback</h3>
            <p>{totalFeedback}</p>
          </div>
        </div>

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
            <h4>🏆 Top Events</h4>

            {data.topEvents && data.topEvents.length > 0 ? (
              data.topEvents.map((event, index) => (
                <p key={index}>
                  {index + 1}. {event.title} ({event.registrations})
                </p>
              ))
            ) : (
              <p>No registrations yet</p>
            )}
          </div>

          <div className="stat-card">
            <h4>👤 Most Active User</h4>
            <p>
              {data.topUser
                ? `${data.topUser.name} (${data.topUser.registrations})`
                : "No active users"}
            </p>
          </div>

          <div className="stat-card">
            <h4>⭐ Highest Rated Event</h4>
            <p>
              {data.highestRatedEvent
                ? `${data.highestRatedEvent.title} (${data.highestRatedEvent.rating})`
                : "No feedback yet"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >

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

        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          ⭐ Average Rating: {avgRating} / 5
        </p>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
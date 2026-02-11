import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./AdminDashboard.css";

// ✅ Import Dummy JSON Data
import eventsData from "../../data/events.json";
import registrationsData from "../../data/registrations.json";
import feedbackData from "../../data/feedback.json";

function AdminDashboard() {
  // ✅ Dynamic Calculations

  // Total Events
  const totalEvents = eventsData.length;

  // Pending Approvals Count
  const pendingApprovals = eventsData.filter(
    (event) => event.status === "pending"
  ).length;

  // Total Registrations Count
  const totalRegistrations = registrationsData.length;

  // Total Feedback Count
  const totalFeedback = feedbackData.length;

  // Recent Events (Top 3)
  const recentEvents = eventsData.slice(0, 3);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage approvals, registrations, and analytics overview.</p>
        </div>

        {/* ✅ Dynamic Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p>{totalEvents}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>{pendingApprovals}</p>
          </div>

          <div className="stat-card">
            <h3>Total Registrations</h3>
            <p>{totalRegistrations}</p>
          </div>

          <div className="stat-card">
            <h3>Feedback Submitted</h3>
            <p>{totalFeedback}</p>
          </div>
        </div>

        {/* ✅ Recent Events Section */}
        <div className="recent-section">
          <h2>Recent Events</h2>

          <div className="recent-events">
            {recentEvents.map((event) => (
              <div key={event._id} className="event-item">
                <h4>{event.title}</h4>

                <span className={`badge ${event.status}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

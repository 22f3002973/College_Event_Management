import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage approvals, registrations, and analytics overview.</p>
        </div>

        {/* Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p>12</p>
          </div>

          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>4</p>
          </div>

          <div className="stat-card">
            <h3>Total Registrations</h3>
            <p>30</p>
          </div>

          <div className="stat-card">
            <h3>Feedback Submitted</h3>
            <p>15</p>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="recent-section">
          <h2>Recent Events</h2>

          <div className="recent-events">
            <div className="event-item approved">
              <h4>Tech Fest</h4>
              <span className="badge approved">Approved</span>
            </div>

            <div className="event-item pending">
              <h4>Cultural Night</h4>
              <span className="badge pending">Pending</span>
            </div>

            <div className="event-item rejected">
              <h4>Sports Meet</h4>
              <span className="badge rejected">Rejected</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

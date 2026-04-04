import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    const [eventsRes, regRes, feedbackRes] = await Promise.all([
      axios.get("http://localhost:5000/admin/events"),
      axios.get("http://localhost:5000/register"),
      axios.get("http://localhost:5000/feedback"),
    ]);

    setEvents(eventsRes.data);
    setRegistrations(regRes.data);
    setFeedback(feedbackRes.data);

  } catch (err) {
    console.error(err);
  }
};

  // Calculations
  const totalEvents = events.length;

  const pendingApprovals = events.filter(
    (event) => event.status === "pending"
  ).length;

  const totalRegistrations = registrations.length;
  const totalFeedback = feedback.length;

  const recentEvents = events.slice(0, 3);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage approvals, registrations, and analytics overview.</p>
        </div>

        {/* Stats */}
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

        {/* Recent Events */}
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
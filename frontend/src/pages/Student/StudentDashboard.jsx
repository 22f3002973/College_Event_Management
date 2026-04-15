import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const [approvedEvents, setApprovedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        const eventsRes = await axios.get(
          "http://localhost:5000/events/approved"
        );
        setApprovedEvents(eventsRes.data || []);

        const regRes = await axios.get(
          `http://localhost:5000/register/${studentId}`
        );

        const registered = regRes.data
          .map((r) => r.event)
          .filter(Boolean);

        setRegisteredEvents(registered);

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const registeredIds = registeredEvents.map((e) => e._id);

  const upcomingEvents = approvedEvents.filter(
    (e) => !registeredIds.includes(e._id)
  );

  if (!user) return <p>Please login again</p>;
  if (loading) return <p>Loading your dashboard...</p>;
  const totalApproved = approvedEvents.length;
  const totalRegistered = registeredEvents.length;

 return (
    <>
      <Navbar />

      <div className="student-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Welcome, {studentId.name}</h1>
          <p className="subtitle">
            Here’s what’s happening around you
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h2>{totalApproved}</h2>
            <p>Available Events</p>
          </div>

          <div className="stat-card">
            <h2>{totalRegistered}</h2>
            <p>Registered Events</p>
          </div>
        </div>

        {/* Registered Events Reminder */}
        <div className="registered-reminder">
          <div className="reminder-header">
            <h2>Your Registered Events</h2>

            {totalRegistered === 0 && (
              <button
                className="secondary-btn"
                onClick={() => navigate("/student/browse")}
              >
                Explore Events
              </button>
            )}
          </div>

          {totalRegistered === 0 ? (
            <p className="motivation-text">
              You haven’t registered for any events yet.  
              Don’t miss out — exciting events are waiting for you!
            </p>
          ) : (
            <>
              <p className="reminder-text">
                REMINDER!! Make sure you attend the following events:
              </p>

              <ul>
                {registeredEvents.slice(0, 3).map((event) => (
                  <li key={event._id}>
                    <strong>{event.title}</strong>
                    <span>
                      {event.date} • {event.venue || "Venue TBD"}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="primary-btn align-right"
                onClick={() => navigate("/student/registered")}
              >
                View Registered Events
              </button>
            </>
          )}
        </div>

        {/* Upcoming Events */}
<div className="upcoming-events">
  <h2>Upcoming Events</h2>

  {upcomingEvents.length === 0 && (
    <p className="empty-text">
      No upcoming events available.
    </p>
  )}

  <ul>
    {upcomingEvents.slice(0, 3).map((event) => (
      <li key={event._id} className="event-item">
                  <strong>{event.title}</strong>
                  <span>
                    {event.date} • {event.venue || "Venue TBD"}
                  </span>
                </li>
    ))}
  </ul>

  {/* See More at bottom-right */}
  <div className="see-more-wrapper">
    <button
      className="secondary-btn"
      onClick={() => navigate("/student/browse")}
    >
      See More
    </button>
  </div>
</div>

      </div>
    </>
  );
};

export default StudentDashboard;

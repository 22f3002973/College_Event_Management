import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

import usersData from "../../data/users.json";
import eventsData from "../../data/events.json";
import registrationsData from "../../data/registrations.json";

import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const users = Array.isArray(usersData) ? usersData : [];
  const events = Array.isArray(eventsData) ? eventsData : [];
  const registrations = Array.isArray(registrationsData)
    ? registrationsData
    : [];

  const loggedInStudentId = "64a1f001";

  const student =
    users.find((u) => u._id === loggedInStudentId) || {
      name: "Student",
    };

  const approvedEvents = events.filter(
    (e) => e.status === "approved"
  );

  const studentRegistrations = registrations.filter(
    (r) => r.studentId === loggedInStudentId
  );
// collect registered event IDs
const registeredEventIds = studentRegistrations.map(
  (r) => r.eventId
);

// approved events NOT registered by the student
const upcomingEvents = approvedEvents.filter(
  (event) => !registeredEventIds.includes(event._id)
);

  return (
    <>
      <Navbar />

      <div className="student-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Welcome, {student.name}</h1>
          <p className="subtitle">
            Here’s what’s happening around you
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h2>{approvedEvents.length}</h2>
            <p>Available Events</p>
          </div>

          <div className="stat-card">
            <h2>{studentRegistrations.length}</h2>
            <p>Registered Events</p>
          </div>
        </div>

        {/* Registered Events Reminder */}
        <div className="registered-reminder">
          <div className="reminder-header">
            <h2>Your Registered Events</h2>

            {studentRegistrations.length === 0 && (
              <button
                className="secondary-btn"
                onClick={() => navigate("/student/browse")}
              >
                Explore Events
              </button>
            )}
          </div>

          {studentRegistrations.length === 0 ? (
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
                {studentRegistrations.map((reg, index) => {
                  const matchedEvent =
                    events.find(e => e._id === reg.eventId) ||
                    events.find(e => e.title === reg.eventTitle);

                  return (
                    <li key={index}>
                      <strong>
                        {matchedEvent?.title || reg.eventTitle || "Event"}
                      </strong>
                      <span>
                        {matchedEvent?.date || reg.date} •{" "}
                        {matchedEvent?.venue || reg.venue}
                      </span>
                    </li>
                  );
                })}
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
    {upcomingEvents.slice(0, 3).map((event, index) => (
      <li key={index} className="event-item">
        <strong>{event.title}</strong>
        <span>
          {event.date} • {event.venue}
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

import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./EventApproval.css";

const EventApproval = () => {
  // Dummy events stored in state
  const [events, setEvents] = useState([
    { id: 1, title: "Tech Fest", status: "pending" },
    { id: 2, title: "Cultural Night", status: "pending" },
    { id: 3, title: "Sports Meet", status: "approved" },
  ]);

  // Approve Event
  const handleApprove = (id) => {
    const updated = events.map((event) =>
      event.id === id ? { ...event, status: "approved" } : event
    );
    setEvents(updated);
  };

  // Reject Event
  const handleReject = (id) => {
    const updated = events.map((event) =>
      event.id === id ? { ...event, status: "rejected" } : event
    );
    setEvents(updated);
  };

  return (
    <>
      <Navbar />

      <div className="approval-page">
        <h1>Event Approval Panel</h1>
        <p>Approve or Reject Organizer Events</p>

        {/* Table Layout */}
        <table className="approval-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>

                <td>
                  <span className={`status-badge ${event.status}`}>
                    {event.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(event.id)}
                    disabled={event.status === "approved"}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(event.id)}
                    disabled={event.status === "rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventApproval;

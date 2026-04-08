import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./EventApproval.css";

const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events/pending");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE EVENT
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/events/approve/${id}`);;
      fetchEvents(); // refresh after update
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  // ✅ REJECT EVENT
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/events/reject/${id}`);;
      fetchEvents(); // refresh after update
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>Loading events...</p>
      </>
    );
  }

  // ❌ Empty UI
  if (events.length === 0) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "20px" }}>No events available</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="approval-page">
        <h1>Event Approval Panel</h1>

        <table className="approval-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>

                <td>
                  <span className={`status-badge status-${event.status}`}>
                    {event.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(event._id)}
                    disabled={event.status === "approved"}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(event._id)}
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
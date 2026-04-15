import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";
import axios from "axios";
import "./RegisteredEvents.css";
import { useState, useEffect } from "react";

const RegisteredEvents = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  useEffect(() => {
    if (!studentId) return;

    const fetchRegisteredEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/register/${studentId}`
        );

        const events = res.data
          .map((r) => r.event)
          .filter(Boolean); // ✅ prevent null

        setRegisteredEvents(events);
      } catch (err) {
        console.error("Failed to fetch registered events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [studentId]);

  const upcomingEvents = registeredEvents.filter(
    (e) => new Date(e.date) >= today
  );

  const pastEvents = registeredEvents.filter(
    (e) => new Date(e.date) < today
  );

  if (!studentId) return <p>Please login again</p>;
  if (loading) return <p>Loading your events...</p>;

  return (
    <>
      <Navbar />

      <div className="registered-events-page">
        <div className="registered-header">
          <h1>Your Registered Events</h1>
          <p>Track your upcoming and past events</p>
        </div>

        {/* UPCOMING */}
        <section className="registered-section">
          <h2>Upcoming Events</h2>

          {upcomingEvents.length > 0 ? (
            <div className="upcoming-list">
              {upcomingEvents.map((event) => (
                <EventCardStud
                  key={event._id}
                  event={event}
                  type="registered"
                  userId={studentId}
                />
              ))}
            </div>
          ) : (
            <p className="empty-text">No upcoming events.</p>
          )}
        </section>

        {/* PAST */}
        <section className="registered-section">
          <h2>Event History</h2>

          {pastEvents.length > 0 ? (
            <div className="history-grid">
              {pastEvents.map((event) => (
                <EventCardStud
                  key={event._id}
                  event={event}
                  type="registered"
                  userId={studentId}
                />
              ))}
            </div>
          ) : (
            <p className="empty-text">No past events.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default RegisteredEvents;
import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";
import axios from "axios";
import "./RegisteredEvents.css";
import { useState, useEffect } from "react";

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in student ID from localStorage
  const studentId = localStorage.getItem("userId");
  const today = new Date();
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        // Call Registration API
        const res = await axios.get(`http://localhost:5000/register/${studentId}`);
        // res.data is an array of { _id, userId, event }
        const events = res.data.map((r) => r.event);
        setRegisteredEvents(events);
      } catch (err) {
        console.error("Failed to fetch registered events:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchRegisteredEvents();
  }, [studentId]);

  

  // split upcoming vs past
  const upcomingEvents = registeredEvents.filter(
    (e) => new Date(e.date) >= today
  );

  const pastEvents = registeredEvents.filter(
    (e) => new Date(e.date) < today
  );

  if (loading) return <p>Loading your events...</p>;
  
  return (
    <>
      <Navbar />

      <div className="registered-events-page">
        {/* Page header */}
        <div className="registered-header">
          <h1>Your Registered Events</h1>
          <p>
            Stay on track with upcoming events and revisit the ones you’ve
            already participated in
          </p>
        </div>

        {/* UPCOMING EVENTS */}
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
            <p className="empty-text">
              You don’t have any upcoming registered events.
            </p>
          )}
        </section>

        {/* PAST EVENTS */}
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
            <p className="empty-text">
              You haven’t attended any events yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default RegisteredEvents;

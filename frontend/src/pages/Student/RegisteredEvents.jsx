import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";

import eventsData from "../../data/events.json";
import registrationsData from "../../data/registrations.json";

import "./RegisteredEvents.css";

const RegisteredEvents = () => {
  // IMPORTANT: use _id, not userId
  const loggedInStudentId = "64a1f001";
  const today = new Date();

  // get registrations of this student
  const studentRegistrations = registrationsData.filter(
    (r) => r.studentId === loggedInStudentId
  );

  // map registrations -> full event objects
  const registeredEvents = studentRegistrations
    .map((reg) => eventsData.find((e) => e._id === reg.eventId))
    .filter(Boolean);

  // split upcoming vs past
  const upcomingEvents = registeredEvents.filter(
    (e) => new Date(e.date) >= today
  );

  const pastEvents = registeredEvents.filter(
    (e) => new Date(e.date) < today
  );

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

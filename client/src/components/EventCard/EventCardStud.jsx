import "./EventCardStud.css";


const EventCardStud = ({ event, type }) => {
  const formattedCreatedAt = new Date(event.createdAt).toLocaleDateString();

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>

      <p className="event-date">📅 {event.date}</p>
      <p className="event-location">📍 {event.venue}</p>

      <p className="event-description">{event.description}</p>

      <p className="event-created">
        🕒 Created on: {formattedCreatedAt}
      </p>

      <div className="event-actions">
        {type === "browse" && (
          <button className="primary-btn">Register</button>
        )}

        {type === "registered" && (
          <span className="registered-badge">Registered</span>
        )}
      </div>
    </div>
  );
};

export default EventCardStud;


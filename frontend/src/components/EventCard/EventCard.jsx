import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
  console.log("Edit clicked", event);
  navigate("/organizer/edit-event", { state: { event } });
};


  const handleDelete = () => {
    alert("Delete functionality will be added later");
  };

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>

      <p>
        Status:{" "}
        <span className={`status-badge status-${event.status}`}>
          {event.status}
        </span>
      </p>

      <p>Date: {event.date}</p>
      <p>Venue: {event.venue}</p>

      <div className="event-actions">
        <button className="edit-btn" onClick={handleEdit}>
          Edit
        </button>

        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;

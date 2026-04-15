import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event, onDelete }) => {  // 🔥 updated props
  const navigate = useNavigate();

  const handleEdit = () => {
    if (event.status === "approved") {
      alert("Approved event cannot be edited!");
      return;
    }
    console.log("Edit clicked", event);
    navigate("/organizer/edit-event", { state: { event } });
  };

  // 🔥 UPDATED DELETE FUNCTION
  const handleDelete = () => {
    if (event.status === "approved") {
      alert("Approved event cannot be deleted!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    
    if (confirmDelete) {
      onDelete(event._id);
    }
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
      <p>Description: {event.description}</p>
      <p>Capacity Left: {event.capacity}
        </p>

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
import { useNavigate } from "react-router-dom";
import "./FeedbackEventCard.css";

const FeedbackEventCard = ({ event, avgRating, feedbackCount }) => {
  const navigate = useNavigate();

  const handleViewFeedback = () => {
    navigate(`/organizer/feedback/${event._id}`);
  };

  return (
    <div className="feedback-card">
      <h3 className="feedback-event-title">{event.title}</h3>

      <p className="feedback-rating">
        ⭐ Average Rating: <strong>{avgRating || "No Ratings Yet"}</strong>
      </p>

      <p className="feedback-count">
        📝 Feedback Count: <strong>{feedbackCount}</strong>
      </p>

      <button
        className="view-feedback-btn"
        onClick={handleViewFeedback}
      >
        View Feedback
      </button>
    </div>
  );
};

export default FeedbackEventCard;

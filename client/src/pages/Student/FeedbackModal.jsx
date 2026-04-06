import { useState } from "react";
import "./StudentFeedback.css";

const FeedbackModal = ({ event, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({
      eventId: event._id,
      eventTitle: event.title,
      rating,
      comment,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Feedback for {event.title}</h3>

        <div className="rating-box">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

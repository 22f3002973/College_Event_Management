import { useState } from "react";
import "./StudentFeedback.css";
import axios from "axios";

const FeedbackModal = ({ event, onClose, onSubmit, userId  }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!userId) {
      setError("⚠️ User not logged in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5003/register/feedback", {
        userId,
        eventId: event._id,
        rating,
        comment,
      });

      if (res.data.success) {
        // Call parent to update local feedback history
        onSubmit({
          _id: res.data.feedback._id,
          event: { _id: event._id, title: event.title },
          rating,
          comment,
          createdAt: res.data.feedback.createdAt,
        });

        onClose(); // Close modal
      } else {
        setError(res.data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submit error:", err.response?.data || err.message);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
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

          {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

import { useParams, useNavigate } from "react-router-dom";
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import eventsData from "../../data/events.json";
import feedbackData from "../../data/feedback.json";
import "./EventFeedbackDetails.css";

const EventFeedbackDetails = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  // Find selected event
  const event = eventsData.find(e => e._id === eventId);

  // Filter feedback for that event
  const eventFeedback = feedbackData.filter(
    fb => fb.eventId === eventId
  );

  return (
    <OrganizerLayout>

      <div className="feedback-details-container">

        {/* Back Button */}
        <button
          className="back-btn"
          onClick={() => navigate("/organizer/feedback")}
        >
          ← Back to Feedback Events
        </button>

        {/* Event Title */}
        <h1 className="feedback-title">
          Feedback for {event?.title}
        </h1>

        {/* Event Info */}
        <div className="feedback-event-info">
          <p><strong>Date:</strong> {event?.date}</p>
          <p><strong>Venue:</strong> {event?.venue}</p>
        </div>

        {/* Feedback Table */}
        <table className="feedback-table">

          <thead>
            <tr>
              <th>Student ID</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Submitted At</th>
            </tr>
          </thead>

          <tbody>

            {eventFeedback.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-feedback">
                  No Feedback Available
                </td>
              </tr>
            ) : (
              eventFeedback.map(fb => (
                <tr key={fb.feedbackId}>
                  <td>{fb.studentId}</td>
                  <td>⭐ {fb.rating}</td>
                  <td>{fb.comment}</td>
                  <td>
                    {new Date(fb.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </OrganizerLayout>
  );
};

export default EventFeedbackDetails;

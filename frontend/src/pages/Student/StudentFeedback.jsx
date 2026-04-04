import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";

import FeedbackModal from "./FeedbackModal";
import "./StudentFeedback.css";

// TEMP mock data (replace with API later)
const attendedEvents = [
  {
    _id: "65e1a101",
    title: "Tech Fest 2026",
    description: "Annual technical event",
    date: "2026-02-10",
    venue: "Auditorium",
    createdAt: "2026-02-01T10:30:00",
  },
  {
    _id: "65e1a102",
    title: "Cultural Night",
    description: "Dance and music performances",
    date: "2026-02-15",
    venue: "Open Ground",
    createdAt: "2026-02-01T10:30:00",
  },
];

const StudentFeedback = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const handleSubmitFeedback = (feedback) => {
    setFeedbackHistory((prev) => [...prev, feedback]);
    setSelectedEvent(null);
  };

  const hasFeedback = (eventId) =>
    feedbackHistory.some((f) => f.eventId === eventId);

  return (
    <>
      <Navbar />

      <div className="feedback-page">
        <h2 className="page-title">Event Feedback</h2>

        {/* ===== SECTION 1: EVENTS ATTENDED ===== */}
        <section>
          <h3 className="section-title">Events Attended</h3>

          <div className="feedback-grid">
            {attendedEvents.map((event) => (
              <div key={event._id} className="feedback-card-wrapper">
                <EventCardStud event={event} type="feedback" />

                {!hasFeedback(event._id) ? (
                  <button
                    className="feedback-btn"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Give Feedback
                  </button>
                ) : (
                  <span className="feedback-given-badge">
                    ✅ Feedback Submitted
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 2: FEEDBACK HISTORY ===== */}
        <section>
          <h3 className="section-title">Your Feedback</h3>

          {feedbackHistory.length === 0 ? (
            <p className="empty-text">No feedback submitted yet.</p>
          ) : (
            <div className="history-grid">
              {feedbackHistory.map((fb, index) => (
                <div key={index} className="history-card">
                  <h4>{fb.eventTitle}</h4>
                  <p className="rating">⭐ {fb.rating} / 5</p>
                  <p className="comment">{fb.comment}</p>
                  <p className="date">
                    Submitted on {new Date(fb.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedEvent && (
        <FeedbackModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </>
  );
};

export default StudentFeedback;

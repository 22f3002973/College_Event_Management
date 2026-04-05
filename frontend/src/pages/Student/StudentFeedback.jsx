import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";

import FeedbackModal from "./FeedbackModal";
import "./StudentFeedback.css";
import axios from "axios";


const StudentFeedback = () => {
  const userId = localStorage.getItem("userId");
  console.log(userId)
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

 // Fetch registrations and feedback from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch all registrations for this user
        const regRes = await axios.get(`http://localhost:5003/register/${userId}`);
        const events = regRes.data.map((reg) => reg.event || { title: "Event not found", date: null });
      setAttendedEvents(events);

        // 2️⃣ Fetch feedback submitted by this user
        const feedbackRes = await axios.get(`http://localhost:5003/register/feedback/${userId}`);
        setFeedbackHistory(feedbackRes.data || []);

      } catch (err) {
       console.error("Error fetching events or feedback:", err.response?.data || err.message);
      setAttendedEvents([]);
      setFeedbackHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleSubmitFeedback = (feedback) => {
    setFeedbackHistory((prev) => [...prev, feedback]);
    setSelectedEvent(null);
  };

  const hasFeedback = (eventId) =>
    feedbackHistory.some((f) => f.event._id === eventId);

  if (loading) return <p>Loading events and feedback...</p>;

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
                 <EventCardStud event={event} type="feedback" userId={userId} />

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
             {feedbackHistory.map((fb) => (
                <div key={fb._id} className="history-card">
                  <h4>{fb.event.title}</h4>
                  <p className="rating">⭐ {fb.rating} / 5</p>
                  <p className="comment">{fb.comment}</p>
                  <p className="date">
                    Submitted on {new Date(fb.createdAt).toLocaleDateString()}
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
          userId={userId}
        />
      )}
    </>
  );
};

export default StudentFeedback;

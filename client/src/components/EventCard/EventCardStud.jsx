import "./EventCardStud.css";
import { useState } from "react";

const EventCardStud = ({ event, type }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const formattedCreatedAt = new Date(event.createdAt).toLocaleDateString();

  return (
    <>
      {/* EVENT CARD */}
      <div className="event-card">
        <h3 className="event-title">{event.title}</h3>

        <p className="event-date">📅 {event.date}</p>
        <p className="event-location">📍 {event.venue}</p>

        <p className="event-description">{event.description}</p>

        {type !== "browse" && type!=="registered"&&type!=="feedback"&&(
          <p className="event-created">
            🕒 Created on: {formattedCreatedAt}
          </p>
        )}

        <div className="event-actions">
          {type === "browse" && !isRegistered && (
            <button
              className="primary-btn"
              onClick={() => setShowConfirm(true)}
            >
              Register
            </button>
          )}

          {type === "browse" && isRegistered && (
            <span className="registered-badge">✅ Registered</span>
          )}

          {type === "registered" && (
            <span className="registered-badge">Registered</span>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL (SCREEN LEVEL) */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Registration</h3>
            <p>
              Do you want to register for <strong>{event.title}</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  setIsRegistered(true);
                  setShowConfirm(false);
                  setShowToast(true);

                  setTimeout(() => setShowToast(false), 2500);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST (SCREEN LEVEL) */}
      {showToast && (
        <div className="toast">
           You’re registered for {event.title}
        </div>
      )}
    </>
  );
};

export default EventCardStud;

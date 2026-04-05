import "./EventCardStud.css";
import { useState, useEffect } from "react";
import axios from "axios";

const EventCardStud = ({ event, type, userId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentCapacity, setCurrentCapacity] = useState(event.capacity || 0);

  const formattedCreatedAt = new Date(event.createdAt).toLocaleDateString();

  // On load, check if user already registered (for registered events page)
 useEffect(() => {
  // Ensure all IDs are strings for comparison
  const registeredUsers = (event.registeredUsers || []).map(String);
  if (registeredUsers.includes(userId?.toString())) {
    setIsRegistered(true);
  }

  // Set capacity from backend
  if (event.capacity !== undefined) setCurrentCapacity(event.capacity);
}, [event, userId]);

  // Function to handle registration API call
  const handleConfirmRegistration = async () => {
    if (!userId) {
    setToastMessage("⚠️ Missing user ID. Cannot register!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setShowConfirm(false);
    return;
  }
    try {
      const response = await axios.post("http://localhost:5000/register/register", {
        userId,
        eventId: event._id,
      });

      if (response.data.success) {
        setIsRegistered(true);
        setCurrentCapacity((prev) => (prev > 0 ? prev - 1 : 0));
        setToastMessage("🎉 You’re registered for " + event.title);
        setShowToast(true);
      } else {
        setToastMessage(response.data.message || "Registration failed");
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
      setToastMessage(
        error.response?.data?.message || "Network error. Try again later."
      );
      setShowToast(true);
    } finally {
      setShowConfirm(false);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <>
      {/* EVENT CARD */}
      <div className="event-card">
        <h3 className="event-title">{event.title}</h3>

        <p className="event-date">📅 {event.date}</p>
        <p className="event-location">📍 {event.venue}</p>

        <p className="event-description">{event.description}</p>

        {type !== "browse" && type !== "registered" && type !== "feedback" && (
          <p className="event-created">🕒 Created on: {formattedCreatedAt}</p>
        )}

        {/* Display real-time capacity */}
        <p className="event-capacity">Capacity left: {currentCapacity}</p>

        <div className="event-actions">
          {type === "browse" && !isRegistered && (
           <button
    className="primary-btn"
    onClick={() => {
      if (!userId) {
        setToastMessage("⚠️ You must be logged in to register!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
        return;
      }
      setShowConfirm(true);
    }}
  >
    Register
  </button>
          )}

          {((type === "browse" && isRegistered) || type === "registered") && (
            <span className="registered-badge">✅ Registered</span>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Registration</h3>
            <p>
              Do you want to register for <strong>{event.title}</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button onClick={handleConfirmRegistration}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && <div className="toast">{toastMessage}</div>}
    </>
  );
};

export default EventCardStud;
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./EditEvent.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const EditEvent = () => {
  const location = useLocation();
  const event = location.state?.event;

  // 🔹 State for form fields
  const [title, setTitle] = useState(event?.title || "");
  const formatDate = (d) => {
    if (!d) return "";
    return d.split("T")[0]; // ensures YYYY-MM-DD
  };
  const [date, setDate] = useState(formatDate(event?.date));
  const [venue, setVenue] = useState(event?.venue || "");
  const [description, setDescription] = useState(event?.description || "");
  const [capacity, setCapacity] = useState(event?.capacity || 0); // 🔹 Added capacity

  // 🔹 Success message state
  const [message, setMessage] = useState("");

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/events/${event._id}`,
        {
          title,
          date,
          venue,
          description,
          capacity, // 🔹 send capacity to backend
        }
      );

      setMessage("✅ Event updated successfully!");
    } catch (error) {
      console.error("Full error:", error);

      const msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      setMessage("❌ " + msg);
    }
  };

  return (
    <OrganizerLayout>
      <div className="edit-container">
        <h1>Edit Event</h1>

        {/* 🔹 Show message */}
        {message && <p className="message">{message}</p>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Venue"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          ></textarea>

          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            placeholder="Capacity"
            min={0}
          />

          <button type="submit">Update Event</button>
        </form>
      </div>
    </OrganizerLayout>
  );
};

export default EditEvent;
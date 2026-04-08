import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./CreateEvent.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {

  const navigate = useNavigate();

  // 🔥 state for form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");   // 🔥 ADDED

  // 🔥 submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.post("http://localhost:5000/events/create", {
      title,
      date,
      venue,
      description,
      organizerId: user._id
    });

    setMessage("✅ Event created successfully!");

    setTimeout(() => {
      navigate("/organizer/events");
    }, 1000);

  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to create event");
  }
};

  return (
    <OrganizerLayout>
      <div className="create-container">
        <h1>Create New Event</h1>

        {/* 🔥 MESSAGE DISPLAY */}
        {message && <p className="message">{message}</p>}

        <form className="create-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input 
            type="text" 
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <textarea 
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <button type="submit">Create Event</button>
        </form>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEvent;
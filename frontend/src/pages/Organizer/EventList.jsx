import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";   // 🔥 ADDED

import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import EventCard from "../../components/EventCard/EventCard";
import "./EventList.css";

const EventList = () => {

  const organizerId = "64a1f002";
  const location = useLocation();   // 🔥 ADDED

  // 🔹 state to store events
  const [events, setEvents] = useState([]);

  // 🔥 DELETE HANDLER (added)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);

      // 🔥 remove from UI instantly
      setEvents(prev => prev.filter(event => event._id !== id));

    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/events/organizer/${organizerId}`
        );
        setEvents(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [location]);   // 🔥 UPDATED

  return (
    <OrganizerLayout>

      <div className="dashboard-container">

        <h1 className="dashboard-title">My Events</h1>

        <div className="eventlist-grid">
          {events.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              onDelete={handleDelete}
            />
          ))}
        </div>

      </div>

    </OrganizerLayout>
  );
};

export default EventList;
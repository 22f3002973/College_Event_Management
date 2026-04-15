import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import EventCard from "../../components/EventCard/EventCard";
import "./EventList.css";

const EventList = () => {

  // ✅ FIXED
  const user = JSON.parse(localStorage.getItem("user"));
  const organizerId = user?._id;

  const location = useLocation();
  const [events, setEvents] = useState([]);

 const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/events/${id}`);

    setEvents(prev => prev.filter(event => event._id !== id));

    alert("Event deleted successfully");

  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Delete failed");
  }
};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/events/organizer/${organizerId}`
        );

        console.log("EVENT LIST RESPONSE:", res.data);

        // ✅ FIXED
        const eventsData = res.data.events || res.data;

        setEvents(eventsData);

      } catch (error) {
        console.error(error);
      }
    };

    if (organizerId) fetchEvents();
  }, [location, organizerId]);

  return (
    <OrganizerLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">My Events</h1>

        <div className="eventlist-grid">
          {events.length === 0 ? (
            <p>No events found</p>
          ) : (
            events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </OrganizerLayout>
  );
};

export default EventList;
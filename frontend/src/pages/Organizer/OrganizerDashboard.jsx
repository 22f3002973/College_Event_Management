import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";

import StatsCard from "../../components/StatsCard/StatsCard";
import EventCard from "../../components/EventCard/EventCard";
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./OrganizerDashboard.css";

const OrganizerDashboard = () => {

  const navigate = useNavigate();
 

  // ✅ get user properly
  const user = JSON.parse(localStorage.getItem("user"));
  const organizerId = user?._id;

  const [organizerEvents, setOrganizerEvents] = useState([]);

  
  // ✅ FETCH EVENTS
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/events/organizer/${organizerId}`
      );

      console.log("API RESPONSE:", res.data);

      const eventsData = res.data.events || res.data;
      setOrganizerEvents(eventsData);
    } catch (error) {
      console.error(error);
      setOrganizerEvents([]);
    }
  };

  if (organizerId) {
    fetchEvents();
  }
}, [organizerId]); // ✅ only depends on organizerId

  // ✅ DELETE HANDLER
 const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/events/${id}`);

    setOrganizerEvents(prev =>
      prev.filter(event => event._id !== id)
    );

    alert("Event deleted successfully");

  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Delete failed");
  }
};


  // ✅ STATS
  const approved = (organizerEvents || []).filter(
    e => e.status === "approved"
  ).length;

  const pending = (organizerEvents || []).filter(
    e => e.status === "pending"
  ).length;

  const rejected = (organizerEvents || []).filter(
    e => e.status === "rejected"
  ).length;

  return (
    <OrganizerLayout>
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Manage and track all your events</p>
          </div>

          <button
            className="create-btn"
            onClick={() => navigate("/organizer/create-event")}
          >
            + Create New Event
          </button>
        </div>

        <div className="stats-section">
          <StatsCard title="Total Events" count={organizerEvents.length} />
          <StatsCard title="Approved" count={approved} />
          <StatsCard title="Pending" count={pending} />
          <StatsCard title="Rejected" count={rejected} />
        </div>

        <h2 className="events-heading">Your Events</h2>

        <div className="events-grid">
          {organizerEvents.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            organizerEvents.map(event => (
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

export default OrganizerDashboard;
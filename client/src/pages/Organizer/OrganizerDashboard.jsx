import eventsData from "../../data/events.json";
import StatsCard from "../../components/StatsCard/StatsCard";
import EventCard from "../../components/EventCard/EventCard";
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./OrganizerDashboard.css";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {

  const navigate = useNavigate();
  const organizerId = "ORG0001";

  const organizerEvents = eventsData.filter(
    event => event.organizerId === organizerId
  );

  const approved = organizerEvents.filter(e => e.status === "approved").length;
  const pending = organizerEvents.filter(e => e.status === "pending").length;
  const rejected = organizerEvents.filter(e => e.status === "rejected").length;

  return (
    <OrganizerLayout>

      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Hello Anushka!</h1>
            <p>Manage and track all your events</p>
          </div>

          <button
            className="create-btn"
            onClick={() => navigate("/organizer/create-event")}
          >
            + Create New Event
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <StatsCard title="Total Events" count={organizerEvents.length} />
          <StatsCard title="Approved" count={approved} />
          <StatsCard title="Pending" count={pending} />
          <StatsCard title="Rejected" count={rejected} />
        </div>

        {/* Events List */}
        <h2 className="events-heading">Your Events</h2>

        <div className="events-grid">
          {organizerEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

      </div>

    </OrganizerLayout>
  );
};

export default OrganizerDashboard;

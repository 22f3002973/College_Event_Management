import eventsData from "../../data/events.json";
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import EventCard from "../../components/EventCard/EventCard";
import "./EventList.css";

const EventList = () => {

  const organizerId = "ORG0001";

  const organizerEvents = eventsData.filter(
    event => event.organizerId === organizerId
  );

  return (
    <OrganizerLayout>

      <div className="dashboard-container">

        <h1 className="dashboard-title">My Events</h1>

        <div className="eventlist-grid">
          {organizerEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

      </div>

    </OrganizerLayout>
  );
};

export default EventList;

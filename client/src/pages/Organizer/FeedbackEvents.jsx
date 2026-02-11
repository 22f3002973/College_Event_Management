import eventsData from "../../data/events.json";
import feedbackData from "../../data/feedback.json";
import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import FeedbackEventCard from "../../components/FeedbackEventCard/FeedbackEventCard";
import "./EventList.css"; // Reusing same styling

const FeedbackEvents = () => {

  const organizerId = "ORG0001";

  // Filter organizer events
  const organizerEvents = eventsData.filter(
    event => event.organizerId === organizerId
  );

  // Function to calculate feedback details
  const getFeedbackStats = (eventId) => {

    const eventFeedbacks = feedbackData.filter(
      fb => fb.eventId === eventId
    );

    const feedbackCount = eventFeedbacks.length;

    const avgRating =
      feedbackCount > 0
        ? (
            eventFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
            feedbackCount
          ).toFixed(1)
        : null;

    return { feedbackCount, avgRating };
  };

  return (
    <OrganizerLayout>

      <div className="dashboard-container">

        <h1 className="dashboard-title">Event Feedback</h1>

        <div className="eventlist-grid">
          {organizerEvents.map(event => {

            const { feedbackCount, avgRating } =
              getFeedbackStats(event._id);

            return (
              <FeedbackEventCard
                key={event._id}
                event={event}
                avgRating={avgRating}
                feedbackCount={feedbackCount}
              />
            );
          })}
        </div>

      </div>

    </OrganizerLayout>
  );
};

export default FeedbackEvents;

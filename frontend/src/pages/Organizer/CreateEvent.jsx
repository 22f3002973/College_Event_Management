import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./CreateEvent.css";

const CreateEvent = () => {
  return (
    <OrganizerLayout>
      <div className="create-container">
        <h1>Create New Event</h1>

        <form className="create-form">
          <input type="text" placeholder="Event Title" />
          <input type="date" />
          <input type="text" placeholder="Venue" />
          <textarea placeholder="Event Description"></textarea>

          <button type="submit">Create Event</button>
        </form>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEvent;


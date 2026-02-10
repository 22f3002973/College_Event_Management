import OrganizerLayout from "../../components/Layout/OrganizerLayout";
import "./EditEvent.css";
import { useLocation } from "react-router-dom";

const EditEvent = () => {

  const location = useLocation();
  const event = location.state?.event;

  return (
    <OrganizerLayout>
      <div className="edit-container">
        <h1>Edit Event</h1>

        <form className="edit-form">
          <input
            type="text"
            defaultValue={event?.title || ""}
          />

          <input
            type="date"
            defaultValue={event?.date || ""}
          />

          <input
            type="text"
            defaultValue={event?.venue || ""}
          />

          <textarea
            defaultValue={event?.description || ""}
          ></textarea>

          <button type="submit">Update Event</button>
        </form>
      </div>
    </OrganizerLayout>
  );
};

export default EditEvent;

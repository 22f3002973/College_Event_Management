import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";
import "./BrowseEvents.css";
import axios from "axios";
import { useEffect } from "react";

const BrowseEvents = () => {
  const [sortType, setSortType] = useState("upcoming");
  const [events, setEvents] = useState([]); 
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events/approved");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchEvents();
}, []);

  const today = new Date();

  const sortedEvents = [...events].sort((a, b) => {
    if (sortType === "upcoming") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortType === "past") {
      return new Date(b.date) - new Date(a.date);
    }

    if (sortType === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortType === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    return 0;
  });

  const todayDate = new Date().toISOString().split("T")[0];

const displayedEvents =
  sortType === "upcoming"
    ? sortedEvents.filter((e) => e.date >= todayDate)
      : sortType === "past"
      ? sortedEvents.filter((e) => new Date(e.date) < today)
      : sortedEvents;

  return (
    <>
      <Navbar />

      <div className="browse-events-page">
        <div className="browse-header">
          <div>
            <h1>Browse Events</h1>
            <p>Explore and register for college events</p>
          </div>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
            <option value="newest">Newest Added</option>
            <option value="oldest">Oldest Added</option>
          </select>
        </div>

        <div className="events-grid">
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event) => (
              <EventCardStud key={event._id} event={event} type="browse"/>
            ))
          ) : (
            <p className="no-events">No events found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseEvents;

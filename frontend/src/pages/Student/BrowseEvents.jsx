import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventCardStud from "../../components/EventCard/EventCardStud";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./BrowseEvents.css";
import axios from "axios";

const BrowseEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  // ✅ FIX: get user correctly
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
         //  1. Fetch events
        const res = await axios.get("http://localhost:5000/events/approved");
        setEvents(res.data);

      //  2. Fetch registrations
        if (userId) {
        const regRes = await axios.get(`http://localhost:5000/register/${userId}`);
        
        const ids = regRes.data.map((r) => r.eventId);
        setRegisteredEventIds(ids);
      }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [userId]);

  const today = new Date();
  const todayDate = new Date().toISOString().split("T")[0];

  // Sorting logic
  const sortedEvents = [...events].sort((a, b) => {
  if (sortType === "upcoming") {
    return new Date(a.date || 0) - new Date(b.date || 0);
  }

  if (sortType === "past") {
    return new Date(b.date || 0) - new Date(a.date || 0);
  }

  if (sortType === "newest") {
    return a.createdAt && b.createdAt
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : b._id.localeCompare(a._id);
  }

  if (sortType === "oldest") {
    return a.createdAt && b.createdAt
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : a._id.localeCompare(b._id);
  }

  return 0;
});

  // Filter + search
  const displayedEvents = (
  sortType === "upcoming"
    ? sortedEvents.filter((e) => e.date && e.date >= todayDate)
    : sortType === "past"
    ? sortedEvents.filter((e) => e.date && new Date(e.date) < today)
    : sortedEvents
).filter((event) =>
  (event.title || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase())
);

  return (
    <>
      <Navbar />

      <div className="browse-events-page">
        <div className="browse-header">
          <div>
            <h1>Browse Events</h1>
            <p>Explore and register for college events</p>
          </div>

          <div className="browse-controls">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />

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
        </div>

        <div className="events-grid">
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event) => (
              <EventCardStud
                key={event._id}
                event={event}
                type="browse"
                userId={userId}
                isRegistered={registeredEventIds.includes(event._id)}
              />
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
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left side: Brand */}
      <div className="navbar-left">
        <h1 className="project-title">EVenTify</h1>
      </div>

      {/* Right side: Navigation */}
      <div className="navbar-right">

        <NavLink
          to="/organizer/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/organizer/events"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          My Events
        </NavLink>

        <NavLink
          to="/organizer/create-event"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Create Event
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

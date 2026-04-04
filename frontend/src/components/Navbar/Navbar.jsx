import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ProfileDrawer from "../Profile/ProfileDrawer";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);

  const path = location.pathname;

  let role = "Student";
  let links = [];

  // Admin Links
  if (path.startsWith("/admin")) {
    role = "Admin";
    links = [
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Approvals", to: "/admin/event-approval" },
      { name: "Analytics", to: "/admin/analytics" },
    ];
  }

  // Organizer Links
  else if (path.startsWith("/organizer")) {
    role = "Organizer";
    links = [
      { name: "Dashboard", to: "/organizer/dashboard" },
      { name: "Create Event", to: "/organizer/create-event" },
      { name: "My Events", to: "/organizer/events" },
    ];
  }

  // Student Links
  else {
    role = "Student";
    links = [
      { name: "Home", to: "/student/dashboard" },
      { name: "Events", to: "/student/browse" },
      { name: "Registered", to: "/student/registered" },
      { name: "Feedback", to: "/student/feedback" },
    ];
  }

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="project-title">EVenTify</h1>
        </div>

        <div className="navbar-right">
          <span className="dashboard-label">{role}</span>

          {/* Links */}
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Profile only for Student */}
          {role === "Student" && (
            <span
              className="nav-link"
              onClick={() => setShowProfile(true)}
              style={{ cursor: "pointer" }}
            >
              Profile
            </span>
          )}

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Drawer */}
      {showProfile && (
        <ProfileDrawer onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Navbar;

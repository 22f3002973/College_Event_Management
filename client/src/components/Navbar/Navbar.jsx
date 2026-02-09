import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout functionality here
    navigate("/login"); // or wherever your login page is
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="project-title">EVenTify</h1>
      </div>

      <div className="navbar-right">
        <span className="dashboard-label">Student</span>
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/student/browse"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/student/registered"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Registered Events
        </NavLink>
        
        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ProfileDrawer from "../Profile/ProfileDrawer"; 


const Navbar = () => {
  const navigate = useNavigate();
const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    // Add logout functionality here
    navigate("/login"); // or wherever your login page is
  };

  return (
    <>
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
          to="/student/feedback"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Feedback
        </NavLink>
        
        <span
  className="nav-link"
  onClick={() => setShowProfile(true)}
>
  Profile
</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
     
    </nav>
    {showProfile && (
  <ProfileDrawer onClose={() => setShowProfile(false)} />
)}
</>
    
  );
};

export default Navbar;

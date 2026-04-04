import { useState } from "react";
import ChangePasswordDrawer from "./ChangePasswordDrawer";
import "./ProfileDrawer.css";

const ProfileDrawer = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const student = {
    name: "Anish Roy",
    email: "anish@gmail.com",
    userId: "STU0001",
    department: "MCA",
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer">
        <div className="drawer-header">
          <h2>Profile</h2>
          <span className="close-icon" onClick={onClose}>✕</span>
        </div>

        <div className="drawer-content">
          <div className="profile-row">
            <span>Name</span>
            <p>{student.name}</p>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <p>{student.email}</p>
          </div>

          <div className="profile-row">
            <span>Student ID</span>
            <p>{student.userId}</p>
          </div>

          <div className="profile-row">
            <span>Department</span>
            <p>{student.department}</p>
          </div>

          <button
            className="drawer-btn"
            onClick={() => setShowPassword(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {showPassword && (
        <ChangePasswordDrawer onClose={() => setShowPassword(false)} />
      )}
    </>
  );
};

export default ProfileDrawer;

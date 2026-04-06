import { useState, useEffect } from "react";
import axios from "axios";
import ChangePasswordDrawer from "./ChangePasswordDrawer";
import "./ProfileDrawer.css";

const ProfileDrawer = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", department: "" });
  const userId = localStorage.getItem("userId");
  
 // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/users/${userId}`);
        if (res.data.success) {
          setProfile(res.data.user);
          setForm({ name: res.data.user.name, department: res.data.user.department });
        }
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save profile updates
  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/users/${userId}`, form);
      if (res.data.success) {
        setProfile(res.data.user);
        setEditMode(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
    }
  };

  if (loading) return <p className="drawer-loading">Loading profile...</p>;
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
            {editMode ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            ) : (
             <p>{profile?.name || "N/A"}</p>
            )}
          </div>

          <div className="profile-row">
            <span>Email</span>
            <p>{profile?.email}</p>
          </div>

          

          <div className="profile-row">
            <span>Department</span>
           {editMode ? (
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
              />
            ) : (
              <p>{profile?.department}</p>
            )}
          </div>

           {editMode ? (
            <div className="drawer-btn-group">
              <button className="drawer-btn" onClick={handleSave}>Save</button>
              <button className="drawer-btn cancel" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button className="drawer-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
              <button className="drawer-btn" onClick={() => setShowPassword(true)}>Change Password</button>
            </>
          )}
        </div>
      </div>

      {showPassword && <ChangePasswordDrawer onClose={() => setShowPassword(false)} />}
    </>
  );
};

export default ProfileDrawer;

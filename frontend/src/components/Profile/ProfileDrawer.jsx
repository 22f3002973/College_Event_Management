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

  // ✅ FIXED USER
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // ✅ FIXED API (use gateway)
        const res = await axios.get(
          `http://localhost:5000/users/${userId}`
        );

        const userData = res.data.user || res.data;

        setProfile(userData);
        setForm({
          name: userData.name,
          department: userData.department,
        });

      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    if (!form.name || !form.department) {
      alert("All fields are required");
      return;
    }

    const res = await axios.put(
      `http://localhost:5000/users/${userId}`,
      form
    );

    const updatedUser = res.data.user || res.data;

    setProfile(updatedUser);
    setEditMode(false);

    // ✅ update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("✅ Profile updated successfully");

  } catch (err) {
    console.error("Update error:", err);
    alert("❌ Failed to update profile");
  }
};

  if (!userId) return <p>Please login again</p>;
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
                name="name"
                value={form.name || ""}
                onChange={handleChange}
              />
            ) : (
              <p>{profile?.name}</p>
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
                name="department"
                value={form.department || ""}
                onChange={handleChange}
              />
            ) : (
              <p>{profile?.department}</p>
            )}
          </div>

          {editMode ? (
            <div className="drawer-btn-group">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={() => setShowPassword(true)}>Change Password</button>
            </>
          )}
        </div>
      </div>

      {showPassword && (
        <ChangePasswordDrawer onClose={() => setShowPassword(false)} />
      )}
    </>
  );
};

export default ProfileDrawer;
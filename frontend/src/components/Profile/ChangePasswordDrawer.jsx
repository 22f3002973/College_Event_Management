import "./ProfileDrawer.css";
import { useState } from "react";
import axios from "axios";

const ChangePasswordDrawer = ({ onClose }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

     await axios.put(
        `http://localhost:5000/users/change-password/${userId}`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }
      );

      alert("✅ Password updated successfully");
      onClose();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer drawer-narrow">
        <div className="drawer-header">
          <h2>Change Password</h2>
          <span className="close-icon" onClick={onClose}>✕</span>
        </div>

        <div className="drawer-content">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={handleChange}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={form.newPassword}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            className="drawer-btn primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordDrawer;
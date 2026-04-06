import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const OrganizerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/users/register", {
        ...form,
        role: "organizer",
      });

      alert("Organizer Registered successfully");
      navigate("/login");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="auth-navbar">
        <h2 className="auth-logo">Eventify</h2>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Organizer Register</h2>

          <input
            className="auth-input"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="auth-input"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="auth-input"
            placeholder="Department"
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="auth-button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default OrganizerRegister;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/users/login", {
      email,
      password,
    });

    const user = res.data.user;

    // Store user
    localStorage.setItem("user", JSON.stringify(user));
    

    // Navigate based on role
    if (user.role === "student") {
  navigate("/student/dashboard");
} 
else if (user.role === "organizer") {
  navigate("/organizer/dashboard");
} 
else if (user.role === "admin") {
  navigate("/admin/dashboard");
} 
else {
  alert("Unknown role");
}

  } catch (err) {
    alert("Invalid credentials");
  }
};

 return (
  <>
    {/* Navbar */}
    <div className="auth-navbar">
      <h2 className="auth-logo">Eventify</h2>
    </div>

    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">EvenTify Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button">Login</button>
        </form>

        <div className="auth-link">
          <p>
            New user? <Link to="/register/student">Register</Link>
          </p>
        </div>
      </div>
    </div>
  </>
);

};

export default Login;

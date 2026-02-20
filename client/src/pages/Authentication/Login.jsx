import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import users from "../../data/users.json";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "student")
      navigate("/student/dashboard");
    else if (user.role === "organizer")
      navigate("/organizer/dashboard");
    else
      navigate("/admin/dashboard");
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

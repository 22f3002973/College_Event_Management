import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="landing-navbar">
        <h2 className="logo">EvenTify</h2>
        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>EvenTify</h1>
          <p className="hero-subtitle">
            Manage, Explore and Organize College Events Seamlessly
          </p>
          <p className="hero-desc">
            A smart platform for students, organizers and admins to manage
            college events efficiently in one place.
          </p>
        </div>
      </section>

      {/* Action Cards */}
      <section className="action-section">
        <div className="action-card">
          <h3>Login</h3>
          <p>Already have an account?</p>
          <button onClick={() => navigate("/login")}>
            Login Now
          </button>
        </div>

        <div className="action-card">
          <h3>Student Registration</h3>
          <p>Join events and explore activities</p>
          <button onClick={() => navigate("/register/student")}>
            Register as Student
          </button>
        </div>

        <div className="action-card">
          <h3>Organizer Registration</h3>
          <p>Create and manage events easily</p>
          <button onClick={() => navigate("/register/organizer")}>
            Register as Organizer
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

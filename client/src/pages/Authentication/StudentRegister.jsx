import "./auth.css";

const StudentRegister = () => {
  return (
    <>
      {/* Navbar */}
      <div className="auth-navbar">
        <h2 className="auth-logo">Eventify</h2>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Student Registration</h2>

          <input className="auth-input" placeholder="Full Name" />
          <input className="auth-input" placeholder="Email" />
          <input className="auth-input" placeholder="Department" />
          <input className="auth-input" type="password" placeholder="Password" />

          <button className="auth-button">Register</button>
        </div>
      </div>
    </>
  );
};

export default StudentRegister;

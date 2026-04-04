import Navbar from "../Navbar/Navbar";
import "./OrganizerLayout.css";

const OrganizerLayout = ({ children }) => {
  return (
    <div className="organizer-layout">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content Area */}
      <main className="organizer-container">
        {children}
      </main>

    </div>
  );
};

export default OrganizerLayout;

import { Routes, Route } from "react-router-dom";

// Authentication
import Login from "../pages/Authentication/Login";

import AnalyticsDashboard from "../pages/Analytics/AnalyticsDashboard";

import LandingPage from "../pages/Landing/LandingPage";
import StudentRegister from "../pages/Authentication/StudentRegister";
import OrganizerRegister from "../pages/Authentication/OrganizerRegister";


// Student
import StudentDashboard from "../pages/Student/StudentDashboard";
import BrowseEvents from "../pages/Student/BrowseEvents";
import RegisteredEvents from "../pages/Student/RegisteredEvents";
import StudentFeedback from "../pages/Student/StudentFeedback";

// Organizer
import OrganizerDashboard from "../pages/Organizer/OrganizerDashboard";
import CreateEvent from "../pages/Organizer/CreateEvent";
import EventList from "../pages/Organizer/EventList";

// Admin
import AdminDashboard from "../pages/Admin/AdminDashboard";
import EventApproval from "../pages/Admin/EventApproval";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/register/organizer" element={<OrganizerRegister />} />


      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/browse" element={<BrowseEvents />} />
      <Route path="/student/registered" element={<RegisteredEvents />} />
      <Route path="/student/feedback" element={<StudentFeedback />} /> 

      <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
      <Route path="/organizer/create-event" element={<CreateEvent />} />
      <Route path="/organizer/events" element={<EventList />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/event-approval" element={<EventApproval />} />
      <Route path="/admin/analytics" element={<AnalyticsDashboard />} />

    </Routes>
  );
};

export default AppRoutes;

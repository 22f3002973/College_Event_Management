import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./AnalyticsDashboard.css";

import eventsData from "../../data/events.json";
import registrationsData from "../../data/registrations.json";
import feedbackData from "../../data/feedback.json";

import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js Components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AnalyticsDashboard() {
  // Event Status Counts
  const approved = eventsData.filter((e) => e.status === "approved").length;
  const pending = eventsData.filter((e) => e.status === "pending").length;
  const rejected = eventsData.filter((e) => e.status === "rejected").length;

  // Total Registrations & Feedback
  const totalRegistrations = registrationsData.length;
  const totalFeedback = feedbackData.length;

  // Average Rating Calculation
  const avgRating =
    totalFeedback > 0
      ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

  // Pie Chart Data (Event Status)
  const pieData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
      },
    ],
  };

  // Bar Chart Data (Registrations per Event)
  const barData = {
    labels: eventsData.map((e) => e.title),
    datasets: [
      {
        label: "Registrations",
        data: eventsData.map(
          (event) =>
            registrationsData.filter((r) => r.eventId === event._id).length
        ),
      },
    ],
  };

  // Feedback Rating Distribution (1⭐ to 5⭐)
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => feedbackData.filter((f) => f.rating === star).length
  );

  // Feedback Rating Chart Data
  const ratingData = {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        label: "Feedback Count",
        data: ratingCounts,
      },
    ],
  };

  return (
    <>
      <Navbar />

      <div className="analytics-page">
        <h1>Analytics Dashboard 📊</h1>
        <p>Event Approval & Registration Insights</p>

        {/* Stats Cards */}
        <div className="analytics-stats">
          <div className="analytics-card">
            <h3>Total Events</h3>
            <p>{eventsData.length}</p>
          </div>

          <div className="analytics-card">
            <h3>Total Registrations</h3>
            <p>{totalRegistrations}</p>
          </div>

          <div className="analytics-card">
            <h3>Total Feedback</h3>
            <p>{totalFeedback}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <h2>Charts & Reports</h2>

          {/* Pie Chart */}
          <div className="chart-box">
            <h3>Event Status Distribution</h3>

            <div className="chart-container">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Registrations Bar Chart */}
          <div className="chart-box">
            <h3>Registrations Per Event</h3>

            <div className="chart-container">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Feedback Rating Chart */}
          <div className="chart-box">
            <h3>Feedback Ratings Summary ⭐</h3>

            <div className="chart-container">
              <Bar
                data={ratingData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            <p style={{ marginTop: "10px" }}>
              Average Rating: <b>{avgRating.toFixed(1)} / 5</b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyticsDashboard;

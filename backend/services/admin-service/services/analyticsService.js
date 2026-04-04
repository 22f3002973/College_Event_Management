const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Feedback = require("../models/Feedback");

exports.getAnalyticsData = async () => {
  const totalEvents = await Event.countDocuments();

  const approved = await Event.countDocuments({ status: "approved" });
  const pending = await Event.countDocuments({ status: "pending" });
  const rejected = await Event.countDocuments({ status: "rejected" });

  const totalRegistrations = await Registration.countDocuments();
  const totalFeedback = await Feedback.countDocuments();

  const feedbacks = await Feedback.find();

  const avgRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

  return {
    totalEvents,
    approved,
    pending,
    rejected,
    totalRegistrations,
    totalFeedback,
    avgRating,
  };
};
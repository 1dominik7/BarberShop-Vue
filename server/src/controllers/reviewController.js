import Appointment from "../models/Appointment.js";
import Barber from "../models/Barber.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const addReview = async (req, res, next) => {
  const { user, barber, rating, comment } = req.body;

  try {
    const existingReview = await Review.findOne({ user, barber });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this barber." });
    }

    const completedAppointment = await Appointment.findOne({
      user,
      barber,
      status: "Completed",
    });

    if (!completedAppointment) {
      return res.status(400).json({
        message: "You can only review after completing an appointment.",
      });
    }

    const newReview = new Review({
      user,
      barber,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    await User.findByIdAndUpdate(user, {
      $push: { reviews: savedReview._id },
    });

    await Barber.findByIdAndUpdate(barber, {
      $push: { reviews: savedReview._id },
    });

    res.status(201).send(savedReview);
  } catch (error) {
    console.error("Error adding review:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding review" });
  }
};

export const getBarberReviews = async (req, res, next) => {
  const { barberId } = req.params;

  try {
    const reviews = await Review.find({ barber: barberId }).populate({
      path: "user",
      select: "name email phone",
    });

    res.status(200).send(reviews || []);
  } catch (error) {
    console.error("Error getting review:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while getting review" });
  }
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const { user, barber } = review;

    await Review.findByIdAndDelete(reviewId);

    await User.findByIdAndUpdate(user, {
      $pull: { reviews: reviewId },
    });

    await Barber.findByIdAndUpdate(barber, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ message: "Review has been deleted!" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting review" });
  }
};

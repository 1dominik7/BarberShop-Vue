import Appointment from "../models/Appointment.js";
import Barber from "../models/Barber.js";
import User from "../models/User.js";
import { generateTemplate } from "../mail/template.js";
import { sendMail } from "../utils/emailService.js";
import dayjs from "dayjs";

export const createAppointment = async (req, res, next) => {
  const { services, userId, barberId, appointmentDate, startTime, endTime } =
    req.body;

  if (
    !services ||
    !userId ||
    !barberId ||
    !appointmentDate ||
    !startTime ||
    !endTime
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const date = new Date(appointmentDate);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: "Invalid appointment date" });
  }

  try {
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const conflictingAppointments = await Appointment.find({
      barber: barberId,
      appointmentDate: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
    });

    if (conflictingAppointments.length > 0) {
      return res.status(409).json({ message: "Time slot is already booked" });
    }

    const newAppointment = new Appointment({
      user: userId,
      barber: barberId,
      services,
      appointmentDate: date,
      startTime,
      endTime,
      status: "Confirmed",
    });
    await newAppointment.save();

    barber.appointments.push(newAppointment._id);

    barber.availability = barber.availability.filter((slot) => {
      return !(
        slot.date.toISOString() === date.toISOString() &&
        slot.startTime === startTime &&
        slot.endTime === endTime
      );
    });
    await barber.save();

    user.appointments.push(newAppointment._id);
    await user.save();

    const emailOptions = {
      username: user.name,
      appointmentDate: appointmentDate,
      serviceName: services.map((service) => service.name).join(", "),
      barberName: barber.name,
      startTime,
    };

    const emailHtml = generateTemplate(emailOptions);

    try {
      await sendMail(
        user.email,
        "Appointment Confirmation",
        "Your appointment is confirmed!",
        emailHtml
      );
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    return res.status(201).json({
      message: "Appointment successfully created",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);

    return res
      .status(500)
      .json({ message: "An error occurred while creating appointment" });
  }
};

export const cancelAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res.status(200).json({
      message: "Appointment successfully cancelled",
      appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);

    return res
      .status(500)
      .json({ message: "An error occurred while cancelling appointment" });
  }
};

export const countAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.countDocuments();

    res.status(200).json({ count: appointments });
  } catch (error) {
    console.error("Error fetching appointments count", error);
    res.status(500).json({
      message: "An error occurred while fetching the appointments count",
    });
  }
};

export const latestAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createAt: 1 })
      .limit(5)
      .populate("barber", "name photo")
      .populate("services", "name shortcut price")
      .populate("user", "name email phone")
      .exec();

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching latest appointments", error);
    res.status(500).json({
      message: "An error occurred while fetching appointments",
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate("barber", "name photo")
      .populate("services", "name shortcut price")
      .populate("user", "name email phone")
      .exec();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching latest appointments", error);
    res.status(500).json({
      message: "An error occurred while fetching appointments",
    });
  }
};

export const getAppointmentInCurrMonthByStatus = async (req, res) => {
  const now = dayjs();
  const startOfMonth = now.startOf("month").toDate();
  const endOfMonth = now.endOf("month").toDate();

  try {
    const appointmentCounts = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      Pending: 0,
      Confirmed: 0,
      Cancelled: 0,
      Completed: 0,
    };

    appointmentCounts.forEach(({ _id, count }) => {
      result[_id] = count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching latest appointments", error);
    res.status(500).json({
      message: "An error occurred while fetching appointments",
    });
  }
};

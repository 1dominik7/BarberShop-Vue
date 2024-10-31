import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Barber from "../models/Barber.js";
import Service from "../models/Service.js";
import { barberValidator, yupValidate } from "../utils/validationSchema.js";

export const addBarber = async (req, res, next) => {
  const { name, photo, phone, services } = req.body;

  try {
    await yupValidate(barberValidator, { name, phone });

    const newBarber = new Barber({
      name,
      photo,
      phone,
      services,
    });

    await newBarber.save();
    res
      .status(201)
      .send({ message: "Barber has been added.", barber: newBarber });
  } catch (error) {
    console.error("Error adding barber:", error);

    if (error.name === "ValidationError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res
      .status(500)
      .json({ message: "An error occurred while adding barber" });
  }
};

export const getBarber = async (req, res, next) => {
  const { barberId } = req.params;
  try {
    const barber = await Barber.findById(barberId)
      .populate({
        path: "appointments",
        populate: [
          {
            path: "user",
            select: "name email phone",
          },
          {
            path: "services",
            select: "name price duration shortcut",
          },
        ],
      })
      .populate({
        path: "services",
        select: "name price duration shortcut",
      });
    res.status(200).send(barber);
  } catch (error) {
    next(error);
  }
};

export const getBarbers = async (req, res, next) => {
  try {
    const barbers = await Barber.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "services",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $addFields: {
          serviceDetails: {
            $ifNull: ["$serviceDetails", []],
          },
        },
      },
    ]);

    res.status(200).send(barbers);
  } catch (error) {
    next(error);
  }
};

export const updateBarber = async (req, res, next) => {
  const { name, phone, photo, services } = req.body;
  const { barberId } = req.params;

  try {
    await yupValidate(barberValidator, { name, phone });

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    barber.name = name;
    barber.phone = phone;
    barber.photo = photo;
    barber.services = services;

    await barber.save();

    res.status(200).send({
      message: "Barber has been updated.",
      barber: {
        _id: barber._id,
        name: barber.name,
        phone: barber.phone,
        photo: barber.photo,
        services: barber.services,
      },
    });
  } catch (error) {
    console.error("Error updating barber:", error);
    if (error.name === "ValidationError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res
      .status(500)
      .json({ message: "An error occurred while updating barber" });
  }
};

export const deleteBarber = async (req, res, next) => {
  const { barberId } = req.params;

  try {
    const barber = await Barber.findByIdAndDelete(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.status(200).json({ message: "Barber has been deleted!" });
  } catch (error) {
    console.error("Error during delete barber:", error);
    res.status(500).json({ error: "Failed to delete barber!" });
  }
};

export const setHoursToBarberSchedule = async (req, res, next) => {
  const { date, start, end } = req.body;
  const { barberId } = req.params;

  try {
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const availabilityIndex = barber.availability.findIndex((slot) => {
      return (
        new Date(slot.date).toDateString() === new Date(date).toDateString()
      );
    });

    if (availabilityIndex >= 0) {
      barber.availability[availabilityIndex].startTime = start;
      barber.availability[availabilityIndex].endTime = end;
    } else {
      barber.availability.push({
        date: new Date(date),
        startTime: start,
        endTime: end,
      });
    }

    await barber.save();

    res
      .status(200)
      .json({ message: "Barber's availability updated successfully", barber });
  } catch (error) {
    console.error("Error creating barber:", error);

    return res
      .status(500)
      .json({ message: "An error occurred while creating barber" });
  }
};

export const deleteHoursToBarberSchedule = async (req, res, next) => {
  const { barberId, availabilityId } = req.params;

  try {
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const availabilityIndex = barber.availability.findIndex(
      (slot) => slot._id.toString() === availabilityId
    );

    if (availabilityIndex === -1) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    barber.availability.splice(availabilityIndex, 1);
    await barber.save();

    res
      .status(200)
      .json({ message: "Barber's availability deleted successfully", barber });
  } catch (error) {
    console.error("Error deleting barber's availability:", error);

    return res.status(500).json({
      message: "An error occurred while deleting barber's availability",
    });
  }
};

export const getBarberAvailability = async (req, res, next) => {
  const { serviceIds } = req.body;
  const { barberId } = req.params;

  try {
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const services = await Service.find({ _id: { $in: serviceIds } });
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "Services not found" });
    }

    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0
    );

    const today = new Date();
    const futureAvailability = barber.availability.filter(
      (slot) => new Date(slot.date) >= today
    );

    let nearestAvailableDate = null;
    const freeTimeSlotsByDate = [];

    for (const availability of futureAvailability) {
      const appointments = await Appointment.find({
        barber: barberId,
        appointmentDate: new Date(availability.date),
      });

      const freeTimeSlots = calculateFreeTimeSlots(availability, appointments);

      const checkIfServiceFits = (freeTimeSlots, totalDuration) => {
        return freeTimeSlots.some(
          (slot) => slot.end - slot.start >= totalDuration
        );
      };

      const isAvailable = checkIfServiceFits(freeTimeSlots, totalDuration);

      if (isAvailable && !nearestAvailableDate) {
        nearestAvailableDate = availability.date;
      }

      freeTimeSlotsByDate.push({
        date: availability.date,
        freeTimeSlots,
      });
    }

    if (nearestAvailableDate) {
      return res.status(200).json({
        message: "Barber is available",
        nearestAvailableDate,
        freeTimeSlotsByDate,
      });
    }
    return res
      .status(404)
      .json({ message: "No available dates found for the selected services" });
  } catch (error) {
    console.error("Error deleting barber's availability:", error);
    return res.status(500).json({
      message: "An error occurred while deleting barber's availability",
    });
  }
};

const calculateFreeTimeSlots = (availability, appointments) => {
  const startTime = availability.startTime;
  const endTime = availability.endTime;

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const availableStart = convertTimeToMinutes(startTime);
  const availableEnd = convertTimeToMinutes(endTime);

  let freeTimeSlots = [{ start: availableStart, end: availableEnd }];

  appointments.forEach((appointment) => {
    const appointmentStart = convertTimeToMinutes(appointment.startTime);
    const appointmentEnd = convertTimeToMinutes(appointment.endTime);

    freeTimeSlots = freeTimeSlots.flatMap((slot) => {
      if (appointmentStart >= slot.end || appointmentEnd <= slot.start) {
        return [slot];
      }

      const newSlots = [];
      if (appointmentStart > slot.start) {
        newSlots.push({ start: slot.start, end: appointmentStart });
      }
      if (appointmentEnd < slot.end) {
        newSlots.push({ start: appointmentEnd, end: slot.end });
      }
      return newSlots;
    });
  });
  return freeTimeSlots;
};

export const countBarbers = async (req, res) => {
  try {
    const barbers = await Barber.countDocuments();

    res.status(200).json({ count: barbers });
  } catch (error) {
    console.error("Error fetching barbers count", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the barbers count" });
  }
};

export const getBarbersStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const barbers = await Barber.find({}, { _id: 1, name: 1 });

    const appointments = await Appointment.aggregate([
      {
        $match: {
          status: "Completed",
          appointmentDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            barber: "$barber",
            month: { $month: "$appointmentDate" },
            year: { $year: "$appointmentDate" },
          },
          totalService: { $sum: { $size: "$services" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [...Array(12).keys()].map((i) => i + 1);

    const results = barbers.map((barber) => {
      const barberDate = appointments.filter(
        (appt) => appt._id.barber.toString() === barber._id.toString()
      );
      const servicesPerMonth = months.map((month) => {
        const found = barberDate.find((appt) => appt._id.month === month);
        return found ? found.totalService : 0;
      });

      return {
        barber: barber.name,
        servicesPerMonth,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching barbers stats", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the barbers stats" });
  }
};

export const getBarberAppointments = async (req, res) => {
  const { barberId } = req.params;
  try {
    const barber = await Barber.findById(barberId)
      .populate({
        path: "appointments",
        populate: [
          {
            path: "user",
            select: "name email phone",
          },
          {
            path: "services",
            select: "name price duration shortcut",
          },
        ],
      })
      .populate("services", "name price duration")
      .exec();

    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.status(200).json(barber);
  } catch (error) {
    console.error("Error fetching barbers stats", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the barbers stats" });
  }
};

import Barber from "../models/Barber.js";
import Service from "../models/Service.js";
import { createError } from "../utils/error.js";
import { serviceValidator, yupValidate } from "../utils/validationSchema.js";

export const createService = async (req, res, next) => {
  const { name, duration, price, shortcut } = req.body;

  try {
    await yupValidate(serviceValidator, { name, duration, price, shortcut });

    const existingService = await Service.findOne({ name });
    if (existingService)
      return next(createError(400, "Service with this name already exists!"));

    const newService = new Service({
      name,
      duration,
      price,
      shortcut,
    });

    await newService.save();
    res
      .status(201)
      .send({ message: "Service has been created.", service: newService });
  } catch (error) {
    console.error("Error creating service:", error);

    if (error.name === "ValidationError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res
      .status(500)
      .json({ message: "An error occurred while creating service" });
  }
};

export const getServices = async (req, res, next) => {
  try {
    const service = await Service.find();

    res.status(200).send(service);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  const { name, duration, price, shortcut } = req.body;
  const { serviceId } = req.params;

  try {
    await yupValidate(serviceValidator, { name, duration, price });

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.name = name;
    service.duration = duration;
    service.price = price;
    service.shortcut = shortcut;

    await service.save();

    res.status(200).send({
      message: "Service has been updated.",
      service: {
        _id: service._id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        shortcut: service.shortcut,
      },
    });
  } catch (error) {
    console.error("Error updating service:", error);

    if (error.name === "ValidationError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: error.errors });
    }

    return res
      .status(500)
      .json({ message: "An error occurred while updating service" });
  }
};

export const deleteService = async (req, res, next) => {
  const { serviceId } = req.params;

  try {
    await Barber.updateMany(
      { services: serviceId },
      { $pull: { services: serviceId } }
    );

    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service has been deleted!" });
  } catch (error) {
    console.error("Error during delete service:", error);
    res.status(500).json({ error: "Failed to delete service!" });
  }
};

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoute from "../src/routes/userRoutes.js";
import serviceRoute from "../src/routes/serviceRoute.js";
import barberRoute from "../src/routes/barberRoute.js";
import appointmentRoute from "../src/routes/appointmentRoute.js";
import reviewRoute from "../src/routes/reviewRoute.js";
import "dotenv/config";
import Appointment from "../src/models/Appointment.js";
import moment from "moment";
import cron from "node-cron";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const port = process.env.PORT || 8800;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use("/api/user", userRoute);
app.use("/api/service", serviceRoute);
app.use("/api/barber", barberRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/review", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(port, () => {
  connect();
  console.log(`Connected to backend, port:${port}.`);
});

cron.schedule("0 * * * *", async () => {
  try {
    const now = moment();

    const allConfirmedAppointments = await Appointment.find({
      status: "Confirmed",
    });
    const appointmentsToUpdate = allConfirmedAppointments.filter(appointment => {
      const endTime = moment(appointment.endTime, "HH:mm");
      const appointmentDate = moment(appointment.appointmentDate);
      return appointmentDate.isSameOrBefore(now, 'day') && endTime.isBefore(now);
    });

    if (appointmentsToUpdate.length > 0) {
      await Promise.all(
        appointmentsToUpdate.map(async (appointment) => {
          appointment.status = "Completed";
          await appointment.save();
        })
      );
      console.log(
        `${appointmentsToUpdate.length} appointments marked as Completed.`
      );
    } else {
      console.log("No appointments to update at this time.");
    }
  } catch (error) {
    console.error("Error updating appointments:", error);
  }
});


export default app;

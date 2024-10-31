import mongoose from "mongoose";

const { Schema } = mongoose;
const BarberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: false,
    },
    photo: {
      type: String,
      default: false,
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: [],
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Barber = mongoose.model("Barber", BarberSchema);
export default Barber;

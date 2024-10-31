import mongoose from "mongoose";

const { Schema } = mongoose;
const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortcut: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);
export default Service;

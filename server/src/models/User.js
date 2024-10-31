import mongoose from "mongoose";

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
    },
    appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: [],
    }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

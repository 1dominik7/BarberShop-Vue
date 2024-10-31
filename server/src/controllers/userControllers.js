import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name) return sendErrRes(res, "Name is missing", 422);
    if (!email) return sendErrRes(res, "Email is missing", 422);
    if (!password) return sendErrRes(res, "Password is missing", 422);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return next(createError(400, "User with this email already exist!"));

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email) return sendErrRes(res, "Email is missing!", 422);
    if (!password) return sendErrRes(res, "Password is missing!", 422);

    const user = await User.findOne({ email: email }).populate({
      path: "appointments",
      populate: [
        {
          path: "barber",
          select: "name phone",
        },
        {
          path: "services",
          select: "name price shortcut",
        },
      ],
    });
    if (!user) return next(createError(422, "Invalid email or password"));

    const age = 1000 * 60 * 60 * 24 * 7;

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return next(createError(422, "Invalid email or password"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userDetails } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(userDetails);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    path: "/",
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Logout Successfully!" });
};

export const userUpdateInfo = async (req, res) => {
  const { name, phone } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "appointments",
      populate: [
        { path: "barber", select: "name phone" },
        {
          path: "services",
          select: "name price shortcut",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.phone = phone;

    await user.save();

    res.status(201).json({
      message: "User has been successfully updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        isAdmin: user.isAdmin,
        appointments: user.appointments,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user" });
  }
};

export const checkIsAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user" });
  }
};

export const countUsers = async (req, res) => {
  try {
    const users = await User.countDocuments({ isAdmin: false });

    res.status(200).json({ count: users });
  } catch (error) {
    console.error("Error fetching users count", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user count" });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching users" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import inputValidator from "../validation/inputValidator.js";

// Function to send a new auth token
const sendAuthToken = (user, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, "motivation-secret");
  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    user,
    token,
  });
};

// Function to register a new user
export const registerUser = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body, "register-user");

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      error: errors,
    });
  }

  const newUser = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  try {
    await newUser.save();
    newUser.password = undefined;
    sendAuthToken(newUser, res);
  } catch (err) {
    next(err);
  }
};

// Function to login a new user
export const loginUser = async (req, res, next) => {
  const { errors, isValid } = inputValidator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      error: errors,
    });
  }

  try {
    const foundUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
      role: req.body.role,
    }).select("+password");

    // Check if the username or email and password match
    if (!foundUser || !(await foundUser.comparePassword(req.body.password, foundUser.password))) {
      return next(new ApiError("The given credentials are invalid", 401));
    }

    if (foundUser.enabled === false) {
      return next(new ApiError("You have been banned. Please contact an admin.", 401));
    }

    foundUser.password = undefined;
    sendAuthToken(foundUser, res);
  } catch (err) {
    next(err);
  }
};

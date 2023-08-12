import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not authorized", 401));
  }

  const decoded = await jwt.verify(token, "motivation-secret");

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ApiError("This user is not authorized", 401));
  }

  req.user = currentUser;
  next();
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return next(new ApiError("You are not permitted to perform this action", 401));
  }
};

export const isExpert = async (req, res, next) => {
  if (req.user.role === "expert") {
    next();
  } else {
    return next(new ApiError("You are not permitted to perform this action", 401));
  }
};

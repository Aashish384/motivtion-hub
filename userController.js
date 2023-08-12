import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import isEmpty from "../utils/isEmpty.js";
import inputValidator from "../validation/inputValidator.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/email.js";

// Function to get my profile
export const getmyProfile = async (req, res, next) => {
  try {
    const myProfile = await User.findById(req.user._id);
    res.status(200).json({
      status: "Success",
      message: "Profile fetched successfully",
      myProfile,
    });
  } catch (err) {
    next(err);
  }
};
// Function to get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await User.findById(req.params.userId);
    res.status(200).json({
      status: "Success",
      message: "Profile fetched successfully",
      userProfile,
    });
  } catch (err) {
    next(err);
  }
};

// Function to edit profile
export const editProfile = async (req, res, next) => {
  let validationData = { ...req.body };
  delete validationData["password"];
  delete validationData["confirmPassword"];
  delete validationData["likes"];
  delete validationData["dislikes"];
  delete validationData["hobbies"];
  delete validationData["problems"];

  const { errors, isValid } = inputValidator(validationData);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: errors,
    });
  }

  const user2 = await User.findById(req.user._id);

  let newUserData = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.likes || (user2.likes && !req.body.likes)) {
    newUserData.likes = req.body.likes;
  }
  if (req.body.dislikes || (user2.dislikes && !req.body.dislikes)) {
    newUserData.dislikes = req.body.dislikes;
  }
  if (req.body.problems || (user2.problems && !req.body.problems)) {
    newUserData.problems = req.body.problems;
  }
  if (req.body.hobbies || (user2.hobbies && !req.body.hobbies)) {
    newUserData.hobbies = req.body.hobbies;
  }

  if (req.file) {
    newUserData.photo = req.file.path.replace(/\\/g, "/");
  }

  // Check for duplicate email or username
  let duplicateErrors = {};
  if (req.body.email !== req.user.email) {
    const foundEmail = await User.findOne({ email: req.body.email });
    if (foundEmail && !foundEmail._id.equals(req.user._id)) {
      duplicateErrors.email = "This email is taken";
    }
  }
  if (req.body.username !== req.user.username) {
    const foundUsername = await User.findOne({ username: req.body.username });
    if (foundUsername && !foundUsername._id.equals(req.user._id)) {
      duplicateErrors.username = "This username is taken";
    }
  }

  if (!isEmpty(duplicateErrors)) {
    return res.status(400).json({
      status: "fail",
      errorType: "invalid-input",
      error: duplicateErrors,
    });
  }

  // If user has input the password
  if (!isEmpty(req.body.password) || !isEmpty(req.body.confirmPassword)) {
    if (req.body.password === req.body.confirmPassword) {
      newUserData.password = await bcrypt.hash(req.body.password, 12);
    } else {
      return res.status(400).json({
        status: "fail",
        errorType: "invalid-input",
        error: {
          password: "The passwords do not match",
        },
      });
    }
  }

  // Update the user profile
  try {
    const user2 = await User.findOneAndUpdate({ _id: req.user._id }, newUserData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      myProfile: user2,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Success",
      message: "Fetched users successfully",
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Function to reset user password
export const resetPassword = async (req, res, next) => {
  try {
    let foundUser = await User.findOne({
      email: req.body.email,
    });
    const passwordResetString = crypto.randomBytes(10).toString("hex");
    foundUser.passwordResetString = passwordResetString;
    await foundUser.save();
    sendPasswordResetEmail(foundUser);
    res.status(200).json({
      status: "success",
      message: "Password reset link sent",
    });
  } catch (err) {
    next(err);
  }
};

// Function to check validity of reset string
export const checkResetString = async (req, res, next) => {
  try {
    const resetString = req.params.resetString;
    let brokenResetString = resetString.split("#");

    const foundUser = await User.findOne({
      passwordResetString: resetString,
    });

    if (!foundUser) {
      res.status(400).json({
        status: "error",
        message: "Invalid password reset string",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Valid password reset link",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Function to create a new password

export const createNewPassword = async (req, res, next) => {
  try {
    const resetString = req.params.resetString;

    const foundUser = await User.findOne({
      passwordResetString: resetString,
    });

    if (!foundUser) {
      res.status(400).json({
        status: "error",
        message: "Invalid password reset string",
      });
    } else {
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      foundUser.password = req.body.password;
      foundUser.passwordResetString = "";
      await foundUser.save();
      sendPasswordResetSuccessEmail(foundUser);
      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Function to send a friend request
export const addFriend = async (req, res) => {
  let user = await User.findById(req.body.userId);

  let mainUser = await User.findById(req.user._id);
  mainUser.friends.push({ user: user._id, status: "sent", sent: new Date() });
  await mainUser.save();
  user.friends.push({ user: mainUser._id, status: "received", sent: new Date() });
  await user.save();

  let updatedUser = await User.findById(req.body.userId);

  res.status(200).json({
    status: "success",
    message: "Friend request sent",
    myProfile: mainUser,
    userProfile: updatedUser,
  });
};

// Function to accept a friend request
export const acceptFriend = async (req, res) => {
  let user = await User.findById(req.user._id);
  let friends = user.friends;
  friends = friends.map((friend) => {
    if (friend.user.equals(req.body.userId)) {
      friend.status = "accepted";
      friend.accepted = new Date();
    }
    return friend;
  });
  user.friends = friends;
  await user.save();

  let user2 = await User.findById(req.body.userId);
  let friends2 = user2.friends;
  friends2 = friends2.map((friend) => {
    if (friend.user.equals(req.user._id)) {
      friend.status = "accepted";
      friend.accepted = new Date();
    }
    return friend;
  });
  user2.friends = friends2;
  await user2.save();

  res.status(200).json({
    status: "success",
    message: "Friend request accepted",
  });
};

// Function to remove a friend
export const removeFriend = async (req, res) => {
  let user = await User.findById(req.user._id);
  let friends = user.friends;
  friends = friends.filter((friend) => {
    return !friend.user.equals(req.body.userId);
  });
  user.friends = friends;
  await user.save();

  let user2 = await User.findById(req.body.userId);
  friends = user2.friends;
  friends = friends.filter((friend) => {
    return !friend.user.equals(req.user._id);
  });
  user2.friends = friends;
  await user2.save();
  res.status(200).json({
    status: "success",
    message: "Friend removed",
  });
};

// Function to fetch list of friends
export const getFriends = async (req, res) => {
  var filter = req.query.filter;
  let user = await User.findById(req.user._id).populate("friends.user");
  var friends = user.friends;

  if (filter == "sent") {
    friends = friends.filter((friend) => friend.status == "sent");
  } else if (filter == "received") {
    friends = friends.filter((friend) => friend.status == "received");
  } else {
    friends = friends.filter((friend) => friend.status == "accepted");
  }

  res.status(200).json({
    status: "success",
    message: "Fetched friends successfully",
    friendRequests: friends,
  });
};

// Function to change a user role
export const changeRole = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);
    user.role = req.body.newRole;
    await user.save();
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    next(err);
  }
};

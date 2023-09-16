import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import { addNotification } from "../utils/addNotification.js";

// Function to create a new challenge
export const createChallenge = async (req, res, next) => {
  try {
    let newChallenge = new Challenge({
      createdBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });

    if (req.file) {
      newChallenge.image = req.file.path.replace(/\\/g, "/");
    }

    await newChallenge.save();

    // Send the notifications
    const users = await User.find({ _id: { $ne: req.user._id } });

    for (let i = 0; i < users.length; i++) {
      await addNotification(
        users[i]._id,
        `${req.user.username} has created a new challenge`,
        "challenge",
        newChallenge._id
      );
    }

    res.status(200).json({
      status: "Success",
      message: "Challenge created successfully",
      challenge: newChallenge,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get all the challenges
export const getChallenges = async (req, res, next) => {
  try {
    let challenges = await Challenge.find()
      .populate("acceptedBy.user createdBy")
      .sort("-createdAt");

    challenges = challenges.filter((challenge) => challenge.createdBy.enabled == true);
    res.status(200).json({
      status: "Success",
      message: "Challenge fetched successfully",
      challenges,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get a challenge
export const getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId).populate("acceptedBy.user");
    res.status(200).json({
      status: "Success",
      message: "Challenge fetched successfully",
      challenge,
    });
  } catch (err) {
    next(err);
  }
};

// Function to edit a challenge
export const editChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.body._id);

    if (req.file) {
      challenge.image = req.file.path.replace(/\\/g, "/");
    }

    challenge.title = req.body.title;
    challenge.description = req.body.description;

    await challenge.save();

    res.status(200).json({
      status: "Success",
      challenge,
    });
  } catch (err) {
    next(err);
  }
};

// Function to delete a challenge
export const deleteChallenge = async (req, res, next) => {
  try {
    await Challenge.findByIdAndDelete(req.params.challengeId);
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

// Function to accept a challenge
export const acceptChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.body.challengeId);

    challenge.acceptedBy.push({
      user: req.user._id,
    });

    await challenge.save();

    let challenges = await Challenge.find().populate("acceptedBy.user").sort("-createdAt");

    challenges = challenges.filter((challenge) => challenge.createdBy.enabled == true);

    res.status(200).json({
      status: "Success",
      message: "Challenge accepted successfully",
      challenges,
    });
  } catch (err) {
    next(err);
  }
};

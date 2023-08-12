import Challenge from "../models/Challenge.js";

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
    const challenges = await Challenge.find().populate("acceptedBy.user");
    res.status(200).json({
      status: "Success",
      message: "Challenge fetched successfully",
      challenges,
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

    const challenges = await Challenge.find().populate("acceptedBy.user");

    res.status(200).json({
      status: "Success",
      message: "Challenge accepted successfully",
      challenges,
    });
  } catch (err) {
    next(err);
  }
};

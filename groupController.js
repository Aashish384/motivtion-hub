import Group from "../models/Group.js";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";

// Function to create a new group
export const createGroup = async (req, res, next) => {
  try {
    let newGroup = new Group({
      createdBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });

    if (req.file) {
      newGroup.image = req.file.path.replace(/\\/g, "/");
    }

    await newGroup.save();

    res.status(200).json({
      status: "Success",
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get all the challenges
export const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().populate("members.user createdBy");
    res.status(200).json({
      status: "Success",
      message: "Groups fetched successfully",
      groups,
    });
  } catch (err) {
    next(err);
  }
};

// Function to add a group member
export const addGroupMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.body.groupId);

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ApiError("User doesn't exist", 400));
    }

    const isFound = group.members.findIndex((el) => user._id.equals(el.user));

    if (isFound >= 0) {
      return next(new ApiError("This user is already present in the group", 400));
    }

    group.members.push({ user: user._id });

    await group.save();

    res.status(200).json({
      status: "Success",
      message: "Member added successfully",
    });
  } catch (err) {
    next(err);
  }
};

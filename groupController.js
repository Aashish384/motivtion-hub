import Group from "../models/Group.js";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import { addNotification } from "../utils/addNotification.js";

// Function to create a new group
export const createGroup = async (req, res, next) => {
  try {
    if (req.user.enabled == false) {
      return next(new ApiError("You are banned", 400));
    }

    let newGroup = new Group({
      createdBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });

    if (req.file) {
      newGroup.image = req.file.path.replace(/\\/g, "/");
    }

    await newGroup.save();

    // Send the notifications
    const users = await User.find({ _id: { $ne: req.user._id } });

    for (let i = 0; i < users.length; i++) {
      await addNotification(
        users[i]._id,
        `${req.user.username} has created a new group`,
        "group",
        newGroup._id
      );
    }

    res.status(200).json({
      status: "Success",
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get all the groups
export const getGroups = async (req, res, next) => {
  try {
    let groups = await Group.find().populate("members.user createdBy");

    groups = groups.filter((group) => group.createdBy.enabled == true);

    res.status(200).json({
      status: "Success",
      message: "Groups fetched successfully",
      groups,
    });
  } catch (err) {
    next(err);
  }
};

// Function to delete a group
export const deleteGroup = async (req, res, next) => {
  try {
    if (req.user.enabled == false) {
      return next(new ApiError("You are banned", 400));
    }

    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({
      status: "Success",
      message: "Groups deleted successfully",
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

    if (!user.enabled) {
      return next(new ApiError("This user is banned", 400));
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

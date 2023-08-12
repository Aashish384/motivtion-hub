import Conversation from "../models/Conversation.js";

// Function to create a new conversation
export const createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    }).populate("members");

    if (!conversation) {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      newConversation.save().then(async (savedConversation) => {
        await savedConversation.populate("members");
        res.status(200).json({
          status: "success",
          conversation: savedConversation,
        });
      });
    } else {
      res.status(200).json({
        status: "success",
        conversation,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Function to get user conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user._id] },
    })
      .populate("members")
      .sort("-createdAt");
    res.status(200).json({
      status: "success",
      conversations,
    });
  } catch (err) {
    next(err);
  }
};

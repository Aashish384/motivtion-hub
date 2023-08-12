import Message from "../models/Message.js";

// Function to create a new message
export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      sender: req.user._id,
      text: req.body.text,
      conversationId: req.body.conversationId,
    });
    newMessage.save().then(async (savedMessage) => {
      await savedMessage.populate({
        path: "conversationId",
        populate: {
          path: "members",
          model: "User",
        },
      });
      await savedMessage.populate("sender");

      res.status(200).json({
        status: "success",
        message: savedMessage,
      });
    });
  } catch (err) {
    next(err);
  }
};

// Function to get all the messages of a conversation
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate({
        path: "conversationId",
        populate: {
          path: "members",
          model: "User",
        },
      })
      .populate("sender");

    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (err) {
    next(err);
  }
};

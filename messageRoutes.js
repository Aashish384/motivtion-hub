import express from "express";

import { createMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createMessage);
router.get("/:conversationId", protect, getMessages);

export default router;

import express from "express";

import { createConversation, getConversations } from "../controllers/conversationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createConversation);
router.get("/", protect, getConversations);

export default router;

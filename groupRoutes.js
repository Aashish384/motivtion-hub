import express from "express";

import upload from "../utils/multer.js";
import { protect, isExpert } from "../middleware/auth.js";
import { createGroup, getGroups, addGroupMember } from "../controllers/groupController.js";

const router = express.Router();

router.post("/new", protect, isExpert, upload.single("image"), createGroup);
router.post("/add-member", protect, isExpert, addGroupMember);
router.get("/", protect, getGroups);

export default router;

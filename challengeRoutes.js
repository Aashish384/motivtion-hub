import express from "express";

import upload from "../utils/multer.js";
import { protect, isExpert } from "../middleware/auth.js";
import {
  createChallenge,
  getChallenges,
  acceptChallenge,
} from "../controllers/challengeController.js";

const router = express.Router();

router.post("/new", protect, isExpert, upload.single("image"), createChallenge);
router.get("/", protect, getChallenges);
router.post("/accept", protect, acceptChallenge);

export default router;

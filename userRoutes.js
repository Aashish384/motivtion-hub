import express from "express";

import upload from "../utils/multer.js";
import {
  getmyProfile,
  getUserProfile,
  editProfile,
  getUsers,
  resetPassword,
  checkResetString,
  createNewPassword,
  getFriends,
  addFriend,
  acceptFriend,
  removeFriend,
  changeRole,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", protect, getmyProfile);
router.get("/get/:userId", protect, getUserProfile);
router.post("/edit", upload.single("photo"), protect, editProfile);
router.get("/users", protect, getUsers);
router.post("/change-role/:userId", protect, isAdmin, changeRole);
router.post("/reset-password", resetPassword);
router.post("/check-reset-string/:resetString", checkResetString);
router.post("/reset-password/:resetString", createNewPassword);
router.get("/friends", protect, getFriends);
router.post("/add-friend", protect, addFriend);
router.post("/accept-friend", protect, acceptFriend);
router.post("/remove-friend", protect, removeFriend);

export default router;

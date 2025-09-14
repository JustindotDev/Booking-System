import express from "express";
import {
  Signup,
  Login,
  Logout,
  CheckAuth,
  UploadProfile,
  RefreshAccessToken,
} from "../controllers/admin.auth.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.put("/upload-profile-pic", ProtectRoute, UploadProfile);
router.get("/check", ProtectRoute, CheckAuth);
router.post("/refresh", RefreshAccessToken);

export default router;

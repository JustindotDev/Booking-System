import express from "express";
import {
  Signup,
  Login,
  Logout,
  CheckAuth,
} from "../controllers/admin.auth.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.post("/check", ProtectRoute, CheckAuth);

export default router;

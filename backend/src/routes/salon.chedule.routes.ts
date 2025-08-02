import express from "express";
import {
  ClosedSchedule,
  DayOffSchedule,
  DeleteSchedule,
  getSchedule,
} from "../controllers/salon.schedule.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/get-schedule", ProtectRoute, getSchedule);
router.post("/day-off-schedule", ProtectRoute, DayOffSchedule);
router.post("/closed-schedule", ProtectRoute, ClosedSchedule);
router.delete("/:id", ProtectRoute, DeleteSchedule);

export default router;

import express from "express";
import {
  ClosedSchedule,
  DeleteSchedule,
  getSchedule,
} from "../controllers/salon.schedule.controllers";

const router = express.Router();

router.get("/get-schedule", getSchedule);
router.post("/closed-schedule", ClosedSchedule);
router.delete("/:id", DeleteSchedule);

export default router;

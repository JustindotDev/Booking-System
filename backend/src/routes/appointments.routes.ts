import express from "express";
import {
  CreateAppointments,
  DeleteAppointments,
  GetAppointments,
} from "../controllers/appointments.controllers";

const router = express.Router();

router.get("/get-appointments", GetAppointments);
router.post("/create-appointments", CreateAppointments);
router.delete("/delete-appointments", DeleteAppointments);

export default router;

import express from "express";
import {
  CreateAppointments,
  DeleteAppointments,
  GetAppointments,
  ConfirmAppointments,
} from "../controllers/appointments.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/get-appointments", ProtectRoute, GetAppointments);
router.post("/create-appointments", ProtectRoute, CreateAppointments);
router.post("/:id", ProtectRoute, ConfirmAppointments);
router.delete("/:id", ProtectRoute, DeleteAppointments);

export default router;

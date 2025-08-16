import express from "express";
import {
  CreateAppointments,
  CancelAppointments,
  GetAppointments,
  ConfirmAppointments,
} from "../controllers/appointments.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/get-appointments", ProtectRoute, GetAppointments);
router.post("/create-appointments", CreateAppointments);
router.put("/confirm/:id", ProtectRoute, ConfirmAppointments);
router.put("/cancel/:id", ProtectRoute, CancelAppointments);

export default router;

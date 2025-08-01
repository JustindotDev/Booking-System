import express from "express";
import {
  CreateTreatments,
  DeleteTreatments,
  GetTreatments,
  UpdateTreatments,
} from "../controllers/treatments.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/get-treatments", ProtectRoute, GetTreatments);
router.post("/create-treatments", ProtectRoute, CreateTreatments);
router.put("/:id", ProtectRoute, UpdateTreatments);
router.delete("/:id", ProtectRoute, DeleteTreatments);

export default router;

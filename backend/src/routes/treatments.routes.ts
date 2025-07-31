import express from "express";
import {
  CreateTreatments,
  DeleteTreatments,
  GetTreatments,
  UpdateTreatments,
} from "../controllers/treatments.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.use(ProtectRoute);
router.get("/get-treatments", GetTreatments);
router.post("/create-treatments", CreateTreatments);
router.put("/:id", UpdateTreatments);
router.delete("/:id", DeleteTreatments);

export default router;

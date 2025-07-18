import express from "express";
import {
  CreateTreatments,
  DeleteTreatments,
  GetTreatments,
  UpdateTreatments,
} from "../controllers/treatments.controllers";

const router = express.Router();

router.get("/get-treatments", GetTreatments);
router.post("/create-treatments", CreateTreatments);
router.put("/:id", UpdateTreatments);
router.delete("/:id", DeleteTreatments);

export default router;

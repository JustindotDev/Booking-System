import express from "express";

import {
  GetContactsInfo,
  InsertContactsInfo,
  UpdateContactsInfo,
} from "../controllers/contacts.info.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/", GetContactsInfo);

router.post("/contacts", ProtectRoute, InsertContactsInfo);
router.put("/contacts/:id", ProtectRoute, UpdateContactsInfo);

export default router;

import express from "express";

import {
  GetContactsInfo,
  AddContactsInfo,
  UpdateContactsInfo,
} from "../controllers/contacts.info.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/", GetContactsInfo);

router.post("/add-contacts", ProtectRoute, AddContactsInfo);
router.put("/:id", ProtectRoute, UpdateContactsInfo);

export default router;

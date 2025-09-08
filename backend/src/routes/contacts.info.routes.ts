import express from "express";

import {
  GetContactsInfo,
  InsertContactsInfo,
  UpdateContactsInfo,
  UpsertAddressInfo,
} from "../controllers/contacts.info.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/", GetContactsInfo);

router.post("/contacts", ProtectRoute, InsertContactsInfo);
router.put("/contacts/:id", ProtectRoute, UpdateContactsInfo);
router.put("/address/:id", ProtectRoute, UpsertAddressInfo);

export default router;

import express from "express";

import {
  GetContactsInfo,
  UpdateContactsInfo,
  UpdateAddressInfo,
} from "../controllers/contacts.info.controllers";
import { ProtectRoute } from "../middleware/admin.auth.middleware";

const router = express.Router();

router.get("/", GetContactsInfo);

router.put("/contacts/:id", ProtectRoute, UpdateContactsInfo);
router.put("/address/:id", ProtectRoute, UpdateAddressInfo);

export default router;

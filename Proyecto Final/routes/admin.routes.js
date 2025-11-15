import express from "express";
import { renderAdminPanel } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/admin", renderAdminPanel);

export default router;

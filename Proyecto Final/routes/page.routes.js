import express from "express";
import { renderHome, renderGamePage } from "../controllers/pages.controller.js";

const router = express.Router();

router.get("/", renderHome);
router.get("/game/:id", renderGamePage);

export default router;

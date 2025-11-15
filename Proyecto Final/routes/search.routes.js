import express from "express";
import {
	searchByName,
	searchByGenre,
	searchByPlatform,
	searchByMainPlatform,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search/:name", searchByName);
router.get("/search/genre/:id", searchByGenre);
router.get("/search/platform/:id", searchByPlatform);
router.get("/mainplatform/:name", searchByMainPlatform);

export default router;
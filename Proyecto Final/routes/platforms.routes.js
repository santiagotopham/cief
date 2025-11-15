import express from "express";
import {
	getPlatforms,
	createPlatform,
	editPlatform,
	deletePlatformController,
	getMainPlatformsController,
} from "../controllers/platforms.controller.js";

const router = express.Router();

router.get("/all", getPlatforms);
router.get("/mainplatform/all", getMainPlatformsController);
router.post("/add", createPlatform);
router.put("/edit", editPlatform);
router.delete("/delete/:id", deletePlatformController);

export default router;

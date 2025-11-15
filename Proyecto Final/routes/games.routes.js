import express from "express";
import {
	getGameById,
	createGame,
	editGame,
	removeGame,
	voteGame,
} from "../controllers/games.controller.js";

const router = express.Router();
router.get("/:id", getGameById);
router.post("/add", createGame);
router.put("/edit", editGame);
router.delete("/delete/:id", removeGame);
router.put("/vote/:gameId", voteGame);

export default router;

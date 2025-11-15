import express from "express";
import {
	getComments,
	addComment,
	removeComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/game/:gameId", getComments);
router.post("/add", addComment);
router.delete("/delete/:id", removeComment);

export default router;

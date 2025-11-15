import express from "express";
import {
	getGenres,
	createGenre,
	editGenre,
	deleteGenreController,
} from "../controllers/genres.controller.js";

const router = express.Router();

router.get("/all", getGenres);
router.post("/add", createGenre);
router.put("/edit", editGenre);
router.delete("/delete/:id", deleteGenreController);

export default router;

import {
	getGenresList,
	saveGenre,
	updateGenre,
	deleteGenre,
} from "../services/genres.service.js";

export async function getGenres(req, res) {
	res.json(await getGenresList());
}

export async function createGenre(req, res) {
	await saveGenre(req.body);
	res.json({ success: true, message: "Genero creado" });
}

export async function editGenre(req, res) {
	await updateGenre(req.body.id || req.body.Id, req.body);
	res.json({ success: true, message: "Genero editado" });
}

export async function deleteGenreController(req, res) {
	await deleteGenre(req.params.id);
	res.json({ success: true, message: "Genero borrado" });
}

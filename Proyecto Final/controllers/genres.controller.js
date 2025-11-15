import {
	getGenresList,
	saveGenre,
	updateGenre,
	deleteGenre,
} from "../services/genres.service.js";

//Obtener todos
export async function getGenres(req, res) {
	res.json(await getGenresList());
}

//Nuevo
export async function createGenre(req, res) {
	await saveGenre(req.body);
	res.json({ success: true, message: "Genero creado" });
}

//Editar
export async function editGenre(req, res) {
	await updateGenre(req.body.id || req.body.Id, req.body);
	res.json({ success: true, message: "Genero editado" });
}

//Eliminar
export async function deleteGenreController(req, res) {
	await deleteGenre(req.params.id);
	res.json({ success: true, message: "Genero borrado" });
}

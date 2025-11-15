import {
	getCommentsByGameId,
	saveComment,
	deleteComment,
} from "../services/comments.service.js";

//Obtener todos segun juego
export async function getComments(req, res) {
	res.json(await getCommentsByGameId(req.params.gameId));
}

//Nuevo
export async function addComment(req, res) {
	await saveComment(req.body);
	res.json({ success: true, message: "Comentario agregado" });
}

//Eliminar
export async function removeComment(req, res) {
	await deleteComment(req.params.id);
	res.json({ success: true, message: "Comentario eliminado" });
}

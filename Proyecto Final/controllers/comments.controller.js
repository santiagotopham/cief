import {
	getCommentsByGameId,
	saveComment,
	deleteComment,
} from "../services/comments.service.js";

export async function getComments(req, res) {
	res.json(await getCommentsByGameId(req.params.gameId));
}

export async function addComment(req, res) {
	await saveComment(req.body);
	res.json({ success: true, message: "Comentario agregado" });
}

export async function removeComment(req, res) {
	await deleteComment(req.params.id);
	res.json({ success: true, message: "Comentario eliminado" });
}

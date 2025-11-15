// import { executeQuery } from "../db/mysql.js";
import { executeQuery } from "../db/turso.js";
import { getCorrectDateFormat } from "../services/common.service.js";

//Obtener segun id de juego
export async function getCommentsByGameId(gameId) {
	const query = `SELECT * FROM Comments
					WHERE GameId = ?
					ORDER BY PublishedDate DESC`;

	let comments = await executeQuery(query, [gameId]);

	comments = comments.map((comment) => {
		comment.PublishedDate = getCorrectDateFormat(comment.PublishedDate);
		return comment;
	});

	return comments;
}

//Nuevo
export async function saveComment(newComment) {
	const sql = `INSERT INTO Comments (GameId, UserName, PublishedDate, Text) VALUES (?, ?, CURRENT_TIMESTAMP, ?)`;
	const values = [newComment.gameId, newComment.userName, newComment.text];

	await executeQuery(sql, values);
}

//Eliminar
export async function deleteComment(id) {
	const sql = "DELETE FROM Comments WHERE Id = ?";
	const values = [id];

	await executeQuery(sql, values);
}

import { openDbConnection } from "../db/connection.js";
import { getCorrectDateFormat } from "../services/common.service.js";

//Obtener segun id de juego
export async function getCommentsByGameId(gameId) {
	const connection = await openDbConnection();
	const query = `SELECT * FROM Comments
					WHERE GameId = ?
					ORDER BY PublishedDate DESC`;

	let [comments] = await connection.query(query, [gameId]);
	await connection.end();

	comments = comments.map((comment) => {
		comment.PublishedDate = getCorrectDateFormat(comment.PublishedDate);
		return comment;
	});

	return comments;
}

//Nuevo
export async function saveComment(newComment) {
	const connection = await openDbConnection();
	const sql = `INSERT INTO Comments (GameId, UserName, PublishedDate, Text) VALUES (?, ?, NOW(), ?)`;
	const values = [newComment.gameId, newComment.userName, newComment.text];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar
export async function deleteComment(id) {
	const connection = await openDbConnection();
	const sql = "DELETE FROM Comments WHERE Id = ? LIMIT 1";
	const values = [id];

	await connection.execute(sql, values);
	await connection.end();
}

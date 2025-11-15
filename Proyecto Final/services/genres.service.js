// import { executeQuery } from "../db/mysql.js";
import { executeQuery } from "../db/turso.js";
import { arrayToString } from "../services/common.service.js";

//Obtener todos
export async function getGenresList() {
	const query = "SELECT * FROM Genres order by Id";
	let genres = await executeQuery(query);

	return genres;
}

//Obtener segun id
export async function getGenreById(id) {
	const query = "SELECT * FROM Genres WHERE Id = ? LIMIT 1";
	let genres = await executeQuery(query, [id]);

	return genres[0];
}

//Obtener segun una lista de ids de juegos
export async function getGenresByGameId(gameIds) {
	const idsString = arrayToString(gameIds);

	const query = `select g.Id as GameId, n.Id as GenreId, n.Name
                    from Games g
                    join GenresPerGame gpg on g.Id = gpg.GameId
                    join Genres n on gpg.GenreId = n.Id
                    where g.Id in (${idsString})`;

	let genres = await executeQuery(query);

	return genres;
}

//Nuevo
export async function saveGenre(newGenre) {
	const sql = "INSERT INTO `Genres`(`Name`) VALUES (?)";
	const values = [newGenre.name || newGenre.Name];

	await executeQuery(sql, values);
}

//Editar
export async function updateGenre(id, updatedGenre) {
	const sql = "UPDATE `Genres` SET `Name` = ? WHERE `Id` = ?";
	const values = [updatedGenre.name || updatedGenre.Name, id];

	await executeQuery(sql, values);
}

//Eliminar
export async function deleteGenre(id) {
	let sql = "DELETE FROM `Genres` WHERE `Id` = ?";
	let values = [id];

	await executeQuery(sql, values);
}

//Asociar a un juego
export async function linkGameToGenresDb(gameId, genresToLink) {
	const genreArray =
		typeof genresToLink === "string"
			? genresToLink
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: genresToLink;

	if (!Array.isArray(genreArray) || genreArray.length === 0) {
		return;
	}

	const sql =
		"INSERT INTO `GenresPerGame`(`GenreId`, `GameId`) VALUES (?, ?)";

	for (const genreId of genreArray) {
		await executeQuery(sql, [genreId, gameId]);
	}
}

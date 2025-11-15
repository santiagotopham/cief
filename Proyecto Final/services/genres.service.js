import { openDbConnection } from "../db/connection.js";
import { arrayToString } from "../services/common.service.js";

//Obtener todos
export async function getGenresList() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Genres order by Id";

	let [genres] = await connection.query(query);
	await connection.end();

	return genres;
}

//Obtener segun id
export async function getGenreById(id) {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Genres WHERE Id = ? LIMIT 1";

	let [genres] = await connection.query(query, [id]);
	await connection.end();

	return genres[0];
}

//Obtener segun una lista de ids de juegos
export async function getGenresByGameId(gameIds) {
	const idsString = arrayToString(gameIds);

	const connection = await openDbConnection();
	const query = `select g.Id as GameId, n.Id as GenreId, n.Name
                    from Games g
                    join GenresPerGame gpg on g.Id = gpg.GameId
                    join Genres n on gpg.GenreId = n.Id
                    where g.Id in (${idsString})`;

	let [genres] = await connection.query(query);
	await connection.end();

	return genres;
}

//Nuevo
export async function saveGenre(newGenre) {
	const connection = await openDbConnection();
	const sql = "INSERT INTO `Genres`(`Name`) VALUES (?)";
	const values = [newGenre.name || newGenre.Name];

	await connection.execute(sql, values);
	await connection.end();
}

//Editar
export async function updateGenre(id, updatedGenre) {
	const connection = await openDbConnection();
	const sql = "UPDATE `Genres` SET `Name` = ? WHERE `Id` = ? LIMIT 1";
	const values = [updatedGenre.name || updatedGenre.Name, id];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar
export async function deleteGenre(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Genres` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Asociar a un juego
export async function linkGameToGenresDb(gameId, genresToLink) {
	const connection = await openDbConnection();

	const genreArray =
		typeof genresToLink === "string"
			? genresToLink
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: genresToLink;

	if (!Array.isArray(genreArray) || genreArray.length === 0) {
		await connection.end();
		return;
	}

	const sql =
		"INSERT INTO `GenresPerGame`(`GenreId`, `GameId`) VALUES (?, ?)";

	for (const genreId of genreArray) {
		await connection.execute(sql, [genreId, gameId]);
	}

	await connection.end();
}

import { openDbConnection } from "../db/connection.js";
import {
	getGenresByGameId,
	linkGameToGenresDb,
} from "../services/genres.service.js";
import {
	getPlatformsByGameId,
	linkGameToPlatformsDb,
} from "../services/platforms.service.js";
import {
	setGameListDateFormat,
	getCorrectDateFormat,
	arrayToString,
} from "../services/common.service.js";

//Obtener lista de juegos
export async function getGamesList(shouldFormatDate) {
	console.log("games");
	const connection = await openDbConnection();
	const query = `select * from Games g`;

	let [games] = await connection.query(query);
	await connection.end();

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
}

//Obtener juego por nombre
export async function getGamesByName(name, shouldFormatDate) {
	const connection = await openDbConnection();
	const query = `select * from Games g where g.Title like '%${name}%'`;

	let [games] = await connection.query(query);
	await connection.end();

	if (!games || games.length == 0) return [];

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
}

//Obtener juego por id
export async function getGameById(id) {
	const connection = await openDbConnection();
	const query = `SELECT * FROM Games where Id = ${id}`;

	let [games] = await connection.query(query);
	await connection.end();

	if (games[0] == null) {
		return res.redirect("/404");
	}

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	games[0].LaunchDate = getCorrectDateFormat(games[0].LaunchDate);

	return games[0];
}

//Obtener lista de juegos segun lista de ids
export async function getGamesByIdList(idsList) {
	const connection = await openDbConnection();

	const idsString = arrayToString(idsList);

	const query = `SELECT * FROM Games where Id in (${idsString})`;

	let [games] = await connection.query(query);
	await connection.end();

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	games = setGameListDateFormat(games);

	return games;
}

//Insertar juego
export async function saveGame(newGame) {
	const connection = await openDbConnection();
	const sql =
		"INSERT INTO `Games`(`Title`, `ImageUrl`, `LaunchDate`, `Developer`, `Category`, `Synopsis`, `ThumbsUpCounter`) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const values = [
		newGame.title,
		newGame.imageUrl,
		newGame.launchDate,
		newGame.developer,
		newGame.category,
		newGame.synopsis,
		0,
	];

	const result = await connection.execute(sql, values);
	await connection.end();

	await linkGameToGenresDb(result[0].insertId, newGame.genres);
	await linkGameToPlatformsDb(result[0].insertId, newGame.platforms);
}

//Actualizar juego
export async function updateGame(id, updatedGame) {
	const connection = await openDbConnection();

	await deleteGenresFromGame(connection, id);
	await deletePlatformsFromGame(connection, id);

	const sql =
		"UPDATE `Games` SET `Title` = ?, `ImageUrl` = ?, `LaunchDate` = ?, `Developer` = ?, `Category` = ?, `Synopsis` = ? WHERE `Id` = ? LIMIT 1";
	const values = [
		updatedGame.title || updatedGame.Title,
		updatedGame.imageUrl || updatedGame.ImageUrl,
		updatedGame.launchDate || updatedGame.LaunchDate,
		updatedGame.developer || updatedGame.Developer,
		updatedGame.category || updatedGame.Category,
		updatedGame.synopsis || updatedGame.Synopsis,
		id,
	];

	await connection.execute(sql, values);
	await connection.end();

	await linkGameToGenresDb(id, updatedGame.genres);
	await linkGameToPlatformsDb(id, updatedGame.platforms);
}

//Actualizar votos
export async function updateGameLikes(id, vote) {
	const connection = await openDbConnection();

	const query = "SELECT ThumbsUpCounter FROM Games WHERE Id = ? LIMIT 1";

	let [result] = await connection.query(query, [id]);
	let likes = result[0].ThumbsUpCounter || 0;
	likes += vote;

	const sql =
		"UPDATE `Games` SET `ThumbsUpCounter` = ? WHERE `Id` = ? LIMIT 1";
	const values = [likes, id];

	await connection.execute(sql, values);
	await connection.end();

	return likes;
}

//Eliminar juego
export async function deleteGame(id) {
	const connection = await openDbConnection();

	await deleteGenresFromGame(connection, id);

	await deletePlatformsFromGame(connection, id);

	let sql = "DELETE FROM `Games` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Cargar entidades relacionadas a una lista de juegos
export async function getRelatedEntitesFromGames(games) {
	const gameIds = games.map((x) => x.Id);

	const gameGenres = await getGenresByGameId(gameIds);
	const gamePlatforms = await getPlatformsByGameId(gameIds);

	return { gameGenres, gamePlatforms };
}

//Borrar generos de un juego
export async function deleteGenresFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "GenresPerGame");
}

//Borrar plataformas de un juego
export async function deletePlatformsFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "PlatformsPerGame");
}

//Borrar entidad relacionada a un juego
export async function deleteRelatedToGame(connection, gameId, tableName) {
	let sql = `DELETE FROM ${tableName} WHERE GameId = ?`;
	let values = [gameId];

	await connection.execute(sql, values);
}

//Obtener juegos segun plataforma principal
export async function getGamesByMainPlatform(mainPlatformId) {
	const connection = await openDbConnection();

	const query = `SELECT ppg.GameId FROM mainplatforms mp
					join Platforms p on mp.Id = p.MainPlatformId
					join PlatformsPerGame ppg on p.Id = ppg.PlatformId
					where mp.Id = ${mainPlatformId}`;

	let [gameIds] = await connection.query(query);

	gameIds = gameIds.map((x) => x.GameId);
	await connection.end();

	const games = await getGamesByIdList(gameIds);

	return games;
}

//Obtener juegos de un genero
export async function getGamesByGenreId(genreId) {
	const connection = await openDbConnection();

	const query = `SELECT GameId FROM GenresPerGame gpg where gpg.GenreId = ?`;

	let [gameIds] = await connection.query(query, [genreId]);

	if (gameIds.length == 0) return [];

	gameIds = gameIds.map((x) => x.GameId);
	await connection.end();

	const games = await getGamesByIdList(gameIds);

	return games;
}

//Obtener juegos de una plataforma
export async function getGamesByPlatformId(platformId) {
	const connection = await openDbConnection();

	const query = `SELECT GameId FROM PlatformsPerGame gpg where gpg.PlatformId = ?`;

	let [gameIds] = await connection.query(query, [platformId]);

	if (gameIds.length == 0) return [];

	gameIds = gameIds.map((x) => x.GameId);
	await connection.end();

	const games = await getGamesByIdList(gameIds);

	return games;
}

//////////////////////  	COMENTARIOS	   //////////////////////

//Obtener comentarios de un juego
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

//Insertar comentario
export async function saveComment(newComment) {
	const connection = await openDbConnection();
	const sql = `INSERT INTO Comments (GameId, UserName, PublishedDate, Text) VALUES (?, ?, NOW(), ?)`;
	const values = [newComment.gameId, newComment.userName, newComment.text];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar comentario
export async function deleteComment(id) {
	const connection = await openDbConnection();
	const sql = "DELETE FROM Comments WHERE Id = ? LIMIT 1";
	const values = [id];

	await connection.execute(sql, values);
	await connection.end();
}

//Armado de objeto complejo de juego con entidades relacionadas
export async function composeGames(games, gameGenres, gamePlatforms) {
	return games.map((currentGame) => {
		let currentGameGenres = gameGenres.filter(
			(y) => y.GameId == currentGame.Id
		);

		let currentGamePlatforms = gamePlatforms.filter(
			(y) => y.GameId == currentGame.Id
		);

		currentGame.Genres = [
			...currentGameGenres.map((z) => {
				return { Id: z.GenreId, Name: z.Name };
			}),
		];

		currentGame.Platforms = [
			...currentGamePlatforms.map((z) => {
				return { Id: z.PlatformId, Name: z.Name };
			}),
		];
		return currentGame;
	});
}

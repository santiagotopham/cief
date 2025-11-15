// import { executeQuery } from "../db/mysql.js";
import { executeQuery } from "../db/turso.js";
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

//Obtener todos
export async function getGamesList(shouldFormatDate) {
	const query = `select * from Games g`;
	let games = await executeQuery(query);

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
}

//Obtener por like de nombre
export async function getGamesByName(name, shouldFormatDate) {
	const query = `select * from Games g where g.Title like ?`;
	let games = await executeQuery(query, [`%${name}%`]);

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

//Obtener por id
export async function getById(id) {
	const query = `SELECT * FROM Games where Id = ?`;
	let games = await executeQuery(query, [id]);

	return games;
}

//Obtener segun lista de ids
export async function getGamesByIdList(idsList) {
	// Validar y sanitizar los IDs
	if (!Array.isArray(idsList) || idsList.length === 0) {
		return [];
	}

	// Filtrar solo valores numéricos válidos
	const validIds = idsList
		.map((id) => parseInt(id, 10))
		.filter((id) => Number.isInteger(id) && id > 0);

	if (validIds.length === 0) {
		return [];
	}

	// Crear placeholders seguros: ?, ?, ?
	const placeholders = validIds.map(() => "?").join(",");
	const query = `SELECT * FROM Games where Id in (${placeholders})`;

	let games = await executeQuery(query, validIds);

	const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
		games
	);
	games = await composeGames(games, gameGenres, gamePlatforms);

	games = setGameListDateFormat(games);

	return games;
}

//Nuevo
export async function saveGame(newGame) {
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

	const result = await executeQuery(sql, values);

	const insertId = result.insertId || result.lastInsertRowid;
	await linkGameToGenresDb(insertId, newGame.genres);
	await linkGameToPlatformsDb(insertId, newGame.platforms);
}

//Editar
export async function updateGame(id, updatedGame) {
	await deleteGenresFromGame(id);
	await deletePlatformsFromGame(id);

	const sql =
		"UPDATE `Games` SET `Title` = ?, `ImageUrl` = ?, `LaunchDate` = ?, `Developer` = ?, `Category` = ?, `Synopsis` = ? WHERE `Id` = ?";
	const values = [
		updatedGame.title || updatedGame.Title,
		updatedGame.imageUrl || updatedGame.ImageUrl,
		updatedGame.launchDate || updatedGame.LaunchDate,
		updatedGame.developer || updatedGame.Developer,
		updatedGame.category || updatedGame.Category,
		updatedGame.synopsis || updatedGame.Synopsis,
		id,
	];

	await executeQuery(sql, values);

	await linkGameToGenresDb(id, updatedGame.genres);
	await linkGameToPlatformsDb(id, updatedGame.platforms);
}

//Votar
export async function updateGameLikes(id, vote) {
	const query = "SELECT ThumbsUpCounter FROM Games WHERE Id = ? LIMIT 1";

	let result = await executeQuery(query, [id]);
	let likes = result[0].ThumbsUpCounter || 0;
	likes += vote;

	const sql =
		"UPDATE `Games` SET `ThumbsUpCounter` = ? WHERE `Id` = ?";
	const values = [likes, id];

	await executeQuery(sql, values);

	return likes;
}

//Eliminar
export async function deleteGame(id) {
	await deleteGenresFromGame(id);
	await deletePlatformsFromGame(id);

	let sql = "DELETE FROM `Games` WHERE `Id` = ?";
	let values = [id];

	await executeQuery(sql, values);
}

//Cargar entidades relacionadas a una lista
export async function getRelatedEntitesFromGames(games) {
	const gameIds = games.map((x) => x.Id);

	const gameGenres = await getGenresByGameId(gameIds);
	const gamePlatforms = await getPlatformsByGameId(gameIds);

	return { gameGenres, gamePlatforms };
}

//Disociar generos
export async function deleteGenresFromGame(gameId) {
	await deleteRelatedToGame(gameId, "GenresPerGame");
}

//Disociar plataformas
export async function deletePlatformsFromGame(gameId) {
	await deleteRelatedToGame(gameId, "PlatformsPerGame");
}

//Disociar entidades relacionadas
export async function deleteRelatedToGame(gameId, tableName) {
	// Whitelist de tablas permitidas para prevenir SQL injection
	const allowedTables = ["GenresPerGame", "PlatformsPerGame"];
	if (!allowedTables.includes(tableName)) {
		throw new Error("Invalid table name");
	}

	let sql = `DELETE FROM ${tableName} WHERE GameId = ?`;
	let values = [gameId];

	await executeQuery(sql, values);
}

//Obtener segun plataforma principal/padre
export async function getGamesByMainPlatform(mainPlatformId) {
	const query = `SELECT ppg.GameId FROM mainplatforms mp
					join Platforms p on mp.Id = p.MainPlatformId
					join PlatformsPerGame ppg on p.Id = ppg.PlatformId
					where mp.Id = ?`;

	let gameIds = await executeQuery(query, [mainPlatformId]);

	gameIds = gameIds.map((x) => x.GameId);

	const games = await getGamesByIdList(gameIds);

	return games;
}

//Obtener segun genero
export async function getGamesByGenreId(genreId) {
	const query = `SELECT GameId FROM GenresPerGame gpg where gpg.GenreId = ?`;

	let gameIds = await executeQuery(query, [genreId]);

	if (gameIds.length == 0) return [];

	gameIds = gameIds.map((x) => x.GameId);

	const games = await getGamesByIdList(gameIds);

	return games;
}

//Obtener segun plataforma
export async function getGamesByPlatformId(platformId) {
	const query = `SELECT GameId FROM PlatformsPerGame gpg where gpg.PlatformId = ?`;

	let gameIds = await executeQuery(query, [platformId]);

	if (gameIds.length == 0) return [];

	gameIds = gameIds.map((x) => x.GameId);

	const games = await getGamesByIdList(gameIds);

	return games;
}

//Armado de objeto complejo con entidades relacionadas
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

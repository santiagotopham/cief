import { openDbConnection } from "../db/connection.js";
import { arrayToString } from "../services/common.service.js";

//Obtener lista de plataformas
export async function getPlatformsList() {
	const connection = await openDbConnection();
	const query = `SELECT 
                    p.Id,
                    p.Name,
                    p.MainPlatformId,
                    mp.Name AS MainPlatformName
                FROM Platforms p
                INNER JOIN MainPlatforms mp ON p.MainPlatformId = mp.Id
                ORDER BY p.Id`;

	let [platforms] = await connection.query(query);
	await connection.end();

	return platforms;
}

//Obtener plataforma segun id
export async function getPlatformById(id) {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Platforms WHERE Id = ? LIMIT 1";

	let [platforms] = await connection.query(query, [id]);
	await connection.end();

	return platforms[0];
}

//Obtener lista de plataformas principales
export async function getMainPlatforms() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM `MainPlatforms` ORDER BY Id";

	let [platforms] = await connection.query(query);
	await connection.end();

	return platforms;
}

//Obtener plataforma principal por nombre
export async function getMainPlatformByName(name) {
	const connection = await openDbConnection();
	const query = "SELECT * FROM `MainPlatforms` WHERE LOWER(Name) = LOWER(?) LIMIT 1";

	let [platforms] = await connection.query(query, [name]);
	await connection.end();

	return platforms[0];
}

//Obtener plataformas segun una lista de juegos
export async function getPlatformsByGameId(gameIds) {
	const idsString = arrayToString(gameIds);

	const connection = await openDbConnection();
	const query = `select g.Id as GameId, p.Id as PlatformId, p.Name
                    from Games g
                    join PlatformsPerGame ppg on g.Id = ppg.GameId
                    join Platforms p on ppg.PlatformId = p.Id
                    where g.Id in (${idsString})`;

	let [platforms] = await connection.query(query);
	await connection.end();

	return platforms;
}

//Insertar plataforma
export async function savePlatform(newPlatform) {
	const connection = await openDbConnection();
	const sql =
		"INSERT INTO `Platforms`(`Name`, `MainPlatformId`) VALUES (?, ?)";
	const values = [
		newPlatform.name || newPlatform.Name,
		newPlatform.mainPlatformId || newPlatform.MainPlatformId,
	];

	await connection.execute(sql, values);
	await connection.end();
}

//Actualizar plataforma
export async function updatePlatform(id, updatedPlatform) {
	const connection = await openDbConnection();
	const sql =
		"UPDATE `Platforms` SET `Name` = ?, `MainPlatformId` = ? WHERE `Id` = ? LIMIT 1";
	const values = [
		updatedPlatform.name || updatedPlatform.Name,
		updatedPlatform.mainPlatformId || updatedPlatform.MainPlatformId,
		id,
	];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar plataforma
export async function deletePlatform(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Platforms` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Insertar relacion de plataformas a un juego
export async function linkGameToPlatformsDb(gameId, platformsToLink) {
	const connection = await openDbConnection();

	const platformArray =
		typeof platformsToLink === "string"
			? platformsToLink
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: platformsToLink;

	if (!Array.isArray(platformArray) || platformArray.length === 0) {
		await connection.end();
		return;
	}

	const sql =
		"INSERT INTO `PlatformsPerGame`(`PlatformId`, `GameId`) VALUES (?, ?)";

	for (const platformId of platformArray) {
		await connection.execute(sql, [platformId, gameId]);
	}

	await connection.end();
}

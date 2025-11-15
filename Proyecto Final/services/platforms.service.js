// import { executeQuery } from "../db/mysql.js";
import { executeQuery } from "../db/turso.js";
import { arrayToString } from "../services/common.service.js";

//Obtener todas
export async function getPlatformsList() {
	const query = `SELECT
                    p.Id,
                    p.Name,
                    p.MainPlatformId,
                    mp.Name AS MainPlatformName
                FROM Platforms p
                INNER JOIN MainPlatforms mp ON p.MainPlatformId = mp.Id
                ORDER BY p.Id`;

	let platforms = await executeQuery(query);

	return platforms;
}

//Obtener segun id
export async function getPlatformById(id) {
	const query = "SELECT * FROM Platforms WHERE Id = ? LIMIT 1";

	let platforms = await executeQuery(query, [id]);

	return platforms[0];
}

//Obtener todas plataformas principales/padres
export async function getMainPlatforms() {
	const query = "SELECT * FROM `MainPlatforms` ORDER BY Id";

	let platforms = await executeQuery(query);

	return platforms;
}

//Obtener plataforma principal segun nombre
export async function getMainPlatformByName(name) {
	const query =
		"SELECT * FROM `MainPlatforms` WHERE LOWER(Name) = LOWER(?) LIMIT 1";

	let platforms = await executeQuery(query, [name]);

	return platforms[0];
}

//Obtener segun una lista de ids de juegos
export async function getPlatformsByGameId(gameIds) {
	// Validar y sanitizar los IDs
	if (!Array.isArray(gameIds) || gameIds.length === 0) {
		return [];
	}

	// Filtrar solo valores numéricos válidos
	const validIds = gameIds
		.map((id) => parseInt(id, 10))
		.filter((id) => Number.isInteger(id) && id > 0);

	if (validIds.length === 0) {
		return [];
	}

	// Crear placeholders seguros: ?, ?, ?
	const placeholders = validIds.map(() => "?").join(",");

	const query = `select g.Id as GameId, p.Id as PlatformId, p.Name
                    from Games g
                    join PlatformsPerGame ppg on g.Id = ppg.GameId
                    join Platforms p on ppg.PlatformId = p.Id
                    where g.Id in (${placeholders})`;

	let platforms = await executeQuery(query, validIds);

	return platforms;
}

//Nuevo
export async function savePlatform(newPlatform) {
	const sql =
		"INSERT INTO `Platforms`(`Name`, `MainPlatformId`) VALUES (?, ?)";
	const values = [
		newPlatform.name || newPlatform.Name,
		newPlatform.mainPlatformId || newPlatform.MainPlatformId,
	];

	await executeQuery(sql, values);
}

//Editar
export async function updatePlatform(id, updatedPlatform) {
	const sql =
		"UPDATE `Platforms` SET `Name` = ?, `MainPlatformId` = ? WHERE `Id` = ?";
	const values = [
		updatedPlatform.name || updatedPlatform.Name,
		updatedPlatform.mainPlatformId || updatedPlatform.MainPlatformId,
		id,
	];

	await executeQuery(sql, values);
}

//Eliminar
export async function deletePlatform(id) {
	let sql = "DELETE FROM `Platforms` WHERE `Id` = ?";
	let values = [id];

	await executeQuery(sql, values);
}

//Asociar a un juego
export async function linkGameToPlatformsDb(gameId, platformsToLink) {
	const platformArray =
		typeof platformsToLink === "string"
			? platformsToLink
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: platformsToLink;

	if (!Array.isArray(platformArray) || platformArray.length === 0) {
		return;
	}

	const sql =
		"INSERT INTO `PlatformsPerGame`(`PlatformId`, `GameId`) VALUES (?, ?)";

	for (const platformId of platformArray) {
		await executeQuery(sql, [platformId, gameId]);
	}
}

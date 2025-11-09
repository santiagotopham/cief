import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import morgan from "morgan";
import mysql from "mysql2/promise";

const app = express();

//////////////////////////////////////////////////////////////////////////////	CONFIGURACIONES INICIALES	/////////////////////////////////////////////////////////////////////////////
process.loadEnvFile();
const PORT = process.env.PORT;
const configConnection = {
	host: process.env.host,
	port: process.env.db_port,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Inicio datos base de la aplicacion
let siteName = "GameRanking";
let mainPlatforms = await getMainPlatformsFromDb();
let navBarMenu = buildNavBarMenu();

//////////////////////////////////////////////////////////////////////////////	RUTAS	///////////////////////////////////////////////////////////////////////////////////////////
app.get("/", async (req, res) => {
	res.render("index", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: "Collecion de juegos",
		navBarItems: navBarMenu,
		games: await getGamesFromDb(true),
	});
});

for (const currentPlatform of mainPlatforms) {
	app.get(
		`/mainplatform/${currentPlatform.Name.toLocaleLowerCase()}`,
		async (req, res) => {
			res.render("search", {
				title: siteName,
				siteName: siteName,
				showMessage: true,
				subTitle: `Juegos de: ${currentPlatform.Name}`,
				navBarItems: navBarMenu,
				games: await filterByMainPlatform(currentPlatform.Id),
			});
		}
	);
}

app.get("/search/:name", async (req, res) => {
	let games = await getGamesByNameFromDb(req.params.name);

	if (games.length == 0) {
		return res.redirect("/404");
	}

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${req.params.name}`,
		navBarItems: navBarMenu,
		games: games,
	});
});

app.get("/game/:id", async (req, res) => {
	let game = await getGameById(req.params.id);

	if (game == null) {
		return res.redirect("/404");
	}

	res.render("game_page", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: game.Title,
		navBarItems: navBarMenu,
		game: game,
	});
});

//////////////////////////////////////////////////////////////////////////////	PANEL ADMIN    //////////////////////////////////////////////////////////////////////////////
app.get("/admin", async (req, res) => {
	res.render("admin", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "admin",
		navBarItems: navBarMenu,
		games: await getGamesFromDb(true),
		genres: await getGenresFromDb(),
		platforms: await getPlatformsFromDb(),
	});
});

app.post("/game/add", async (req, res) => {
	const newGame = req.body;

	await saveGameToDb(newGame);

	res.json({ success: true, message: "Juego creado" });
});

app.post("/game/edit", async (req, res) => {
	const updatedGame = req.body;

	await updateGameInDb(updatedGame.id, updatedGame);

	res.json({ success: true, message: "Juego editado" });
});

app.post("/game/vote/:gameId", async (req, res) => {
	await updateGameLikes(req.params.gameId, req.body.direction);

	res.json({ success: true, message: "Voto aceptado" });
});

app.delete("/game/delete/:id", async (req, res) => {
	const id = req.params.id;

	await deleteGameFromDb(id);

	res.json({ success: true, message: "Juego borrado" });
});

app.get("/genre/all", async (req, res) => {
	res.json(await getGenresFromDb());
});

app.post("/genre/add", async (req, res) => {
	const newGenre = req.body;

	await saveGenreToDb(newGenre);

	res.json({ success: true, message: "Genero creado" });
});

app.post("/genre/edit", async (req, res) => {
	const updatedGenre = req.body;

	await updateGenreInDb(updatedGenre.id, updatedGenre);

	res.json({ success: true, message: "Genero editado" });
});

app.delete("/genre/delete/:id", async (req, res) => {
	const id = req.params.id;

	await deleteGenreFromDb(id);

	res.json({ success: true, message: "Genero borrado" });
});

app.get("/platform/all", async (req, res) => {
	res.json(await getPlatformsFromDb());
});

app.post("/platform/add", async (req, res) => {
	const newPlatform = req.body;

	await savePlatformToDb(newPlatform);

	res.json({ success: true, message: "Plataforma creada" });
});

app.post("/platform/edit", async (req, res) => {
	const updatedPlatform = req.body;

	await updatePlatformInDb(updatedPlatform.id, updatedPlatform);

	res.json({ success: true, message: "Plataforma editada" });
});

app.delete("/platform/delete/:id", async (req, res) => {
	const id = req.params.id;

	await deletePlatformFromDb(id);

	res.json({ success: true, message: "Plataforma borrada" });
});

//////////////////////////////////////////////////////////////////////////////	404   //////////////////////////////////////////////////////////////////////////////
app.use((req, res) => {
	res.render("404", {
		title: "Error 404",
		siteName: siteName,
		subTitle: "Error 404",
		navBarItems: navBarMenu,
	});
});

//////////////////////////////////////////////////////////////////////////////	SERVER START    //////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

//////////////////////////////////////////////////////////////////////////////	BASE DE DATOS    //////////////////////////////////////////////////////////////////////////////
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

//Metodos de gestion de datos
async function getGamesFromDb(shouldFormatDate) {
	const connection = await openDbConnection();
	const query = `select * from Games g`;

	let [games] = await connection.query(query);
	await connection.end();

	games = await composeGames(games);

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
}

async function getGamesByNameFromDb(name, shouldFormatDate) {
	const connection = await openDbConnection();
	const query = `select * from Games g where g.Title like '%${name}%'`;

	let [games] = await connection.query(query);
	await connection.end();

	games = await composeGames(games);

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
}

async function composeGames(games) {
	const gameIds = games.map((x) => x.Id);
	const gameGenres = await getGenresByGameIdFromDb(gameIds);
	const gamePlatforms = await getPlatformsByGameIdFromDb(gameIds);

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

async function getMainPlatformsFromDb() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM MainPlatforms";

	let [mainPlatforms] = await connection.query(query);
	await connection.end();

	return mainPlatforms;
}

async function getGenresFromDb() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Genres";

	let [genres] = await connection.query(query);
	await connection.end();

	return genres;
}

async function getGenresByGameIdFromDb(gameIds) {
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

async function getPlatformsFromDb() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Platforms";

	let [platforms] = await connection.query(query);
	await connection.end();

	return platforms;
}

async function getPlatformsByGameIdFromDb(gameIds) {
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

async function filterByMainPlatform(mainPlatformId) {
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

async function getGameById(id) {
	const connection = await openDbConnection();
	const query = `SELECT * FROM Games where Id = ${id}`;

	const [games] = await connection.query(query);
	await connection.end();

	if (games[0] == null) {
		return res.redirect("/404");
	}

	games[0].LaunchDate = getCorrectDateFormat(games[0].LaunchDate);

	return games[0];
}

async function getGamesByIdList(idsList) {
	const connection = await openDbConnection();

	const idsString = arrayToString(idsList);

	const query = `SELECT * FROM Games where Id in (${idsString})`;

	let [games] = await connection.query(query);
	await connection.end();

	games = await composeGames(games);

	games = setGameListDateFormat(games);

	return games;
}

async function saveGameToDb(newGame) {
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

async function linkGameToGenresDb(gameId, genresToLink) {
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

async function linkGameToPlatformsDb(gameId, platformsToLink) {
	const connection = await openDbConnection();

	console.log(platformsToLink);

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

async function updateGameInDb(id, updatedGame) {
	const connection = await openDbConnection();

	await deleteGenresFromGame(connection, id);
	await deletePlatformsFromGame(connection, id);

	const sql =
		"UPDATE `Games` SET `Title` = ?, `ImageUrl` = ?, `LaunchDate` = ?, `Developer` = ?, `Category` = ?, `Synopsis` = ? WHERE `Id` = ? LIMIT 1";
	const values = [
		updatedGame.title,
		updatedGame.imageUrl,
		updatedGame.launchDate,
		updatedGame.developer,
		updatedGame.category,
		updatedGame.synopsis,
		id,
	];

	await connection.execute(sql, values);
	await connection.end();

	await linkGameToGenresDb(id, updatedGame.updateGenres);
	await linkGameToPlatformsDb(id, updatedGame.updatePlatforms);
}

async function deleteGameFromDb(id) {
	const connection = await openDbConnection();

	await deleteGenresFromGame(connection, id);

	await deletePlatformsFromGame(connection, id);

	let sql = "DELETE FROM `Games` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

async function deleteGenresFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "GenresPerGame");
}

async function deletePlatformsFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "PlatformsPerGame");
}

async function deleteRelatedToGame(connection, gameId, tableName) {
	let sql = `DELETE FROM ${tableName} WHERE GameId = ?`;
	let values = [gameId];

	let result = await connection.execute(sql, values);
	console.log(result[0]);
}

async function saveGenreToDb(newGenre) {
	const connection = await openDbConnection();
	const sql = "INSERT INTO `Genres`(`Name`) VALUES (?)";
	const values = [newGenre.Name];

	await connection.execute(sql, values);
	await connection.end();
}

async function updateGenreInDb(id, updatedGenre) {
	const connection = await openDbConnection();
	const sql = "UPDATE `Genres` SET `Name` = ? WHERE `Id` = ? LIMIT 1";
	const values = [updatedGenre.Name, id];

	await connection.execute(sql, values);
	await connection.end();
}

async function deleteGenreFromDb(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Genres` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

async function savePlatformToDb(newPlatform) {
	console.log(newPlatform);
	const connection = await openDbConnection();
	const sql = "INSERT INTO `Platforms`(`Name`) VALUES (?)";
	const values = [newPlatform.Name];

	await connection.execute(sql, values);
	await connection.end();
}

async function updatePlatformInDb(id, updatedPlatform) {
	const connection = await openDbConnection();
	const sql = "UPDATE `Platforms` SET `Name` = ? WHERE `Id` = ? LIMIT 1";
	const values = [updatedPlatform.Name, id];

	await connection.execute(sql, values);
	await connection.end();
}

async function deletePlatformFromDb(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Platforms` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//////////////////////////////////////////////////////////////////////////////	CONSTRUCCION DE CONTENIDO    //////////////////////////////////////////////////////////////////////////////
function buildNavBarMenu() {
	let list = '<ul class="container">';
	for (const currentPlatform of mainPlatforms) {
		list += `<li><a href="/mainplatform/${currentPlatform.Name.toLowerCase()}">${
			currentPlatform.Name
		}</a></li>`;
	}
	return list;
}

//////////////////////////////////////////////////////////////////////////////	METODOS AUXILIARES    //////////////////////////////////////////////////////////////////////////////
function setGameListDateFormat(games) {
	games = games.map((currentGame) => {
		currentGame.LaunchDate = getCorrectDateFormat(currentGame.LaunchDate);
		return currentGame;
	});

	return games;
}

function getCorrectDateFormat(unformattedDate) {
	const date = new Date(unformattedDate);
	return date.toLocaleDateString("es-ES").replaceAll(/\//g, "-");
}

function arrayToString(array) {
	return array.join(",");
}

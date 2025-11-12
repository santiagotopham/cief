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
let mainPlatforms = await getMainPlatforms();
let navBarMenu = buildNavBarMenu();

//////////////////////////////////////////////////////////////////////////////	RUTAS	///////////////////////////////////////////////////////////////////////////////////////////

//Index
app.get("/", async (req, res) => {
	res.render("index", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: "Collecion de juegos",
		navBarItems: navBarMenu,
		games: await getGamesList(true),
	});
});

//Categorias del Navbar
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
				games: await getGamesByMainPlatform(currentPlatform.Id),
			});
		}
	);
}

//Buscador por nombre
app.get("/search/:name", async (req, res) => {
	const games = await getGamesByName(req.params.name);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${req.params.name}`,
		navBarItems: navBarMenu,
		games: games,
	});
});

//Buscador por genero
app.get("/search/genre/:id", async (req, res) => {
	const games = await getGamesByGenreId(req.params.id);

	const genre = await getGenreById(req.params.id);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${genre.Name}`,
		navBarItems: navBarMenu,
		games: games,
	});
});

//Buscador por plataforma
app.get("/search/platform/:id", async (req, res) => {
	const games = await getGamesByPlatformId(req.params.id);

	const platform = await getPlatformById(req.params.id);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${platform.Name}`,
		navBarItems: navBarMenu,
		games: games,
	});
});

//Paginas individuales
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

//Panel
app.get("/admin", async (req, res) => {
	res.render("admin", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "admin",
		navBarItems: navBarMenu,
		games: await getGamesList(false),
		genres: await getGenresList(),
		platforms: await getPlatformsList(),
		mainPlatforms: await getMainPlatforms(),
	});
});

//////////////////////  	JUEGOS	   //////////////////////

//Crear juego
app.post("/game/add", async (req, res) => {
	const newGame = req.body;

	await saveGame(newGame);

	res.json({ success: true, message: "Juego creado" });
});

//Editar juego
app.put("/game/edit", async (req, res) => {
	const updatedGame = req.body;

	await updateGame(updatedGame.id || updatedGame.Id, updatedGame);

	res.json({ success: true, message: "Juego editado" });
});

//Votacion
app.put("/game/vote/:gameId", async (req, res) => {
	if (req.body.vote !== 1 && req.body.vote !== -1) {
		return res
			.status(400)
			.json({ success: false, message: "Voto inválido" });
	}

	const updatedLikes = await updateGameLikes(
		req.params.gameId,
		req.body.vote
	);

	res.json({
		success: true,
		message: "Voto aceptado",
		ThumbsUpCounter: updatedLikes,
	});
});

//Eliminar juego
app.delete("/game/delete/:id", async (req, res) => {
	const id = req.params.id;

	await deleteGame(id);

	res.json({ success: true, message: "Juego borrado" });
});

//////////////////////  	COMENTARIOS	   //////////////////////

//Obtener comentarios de un juego
app.get("/comment/game/:gameId", async (req, res) => {
	res.json(await getCommentsByGameId(req.params.gameId));
});

//Nuevo comentario
app.post("/comment/add", async (req, res) => {
	const newComment = req.body;

	await saveComment(newComment);

	res.json({ success: true, message: "Comentario agregado" });
});

//Eliminar comentario
app.delete("/comment/delete/:id", async (req, res) => {
	await deleteComment(req.params.id);

	res.json({ success: true, message: "Comentario eliminado" });
});

//////////////////////  	GENEROS	   //////////////////////

//Obtener generos
app.get("/genre/all", async (req, res) => {
	res.json(await getGenresList());
});

//Crear genero
app.post("/genre/add", async (req, res) => {
	const newGenre = req.body;

	await saveGenre(newGenre);

	res.json({ success: true, message: "Genero creado" });
});

//Editar genero
app.put("/genre/edit", async (req, res) => {
	const updatedGenre = req.body;

	await updateGenre(updatedGenre.id || updatedGenre.Id, updatedGenre);

	res.json({ success: true, message: "Genero editado" });
});

//Eliminar genero
app.delete("/genre/delete/:id", async (req, res) => {
	await deleteGenre(req.params.id);

	res.json({ success: true, message: "Genero borrado" });
});

//////////////////////  	PLATAFORMAS	   //////////////////////

//Obtener plataformas
app.get("/platform/all", async (req, res) => {
	res.json(await getPlatformsList());
});

//Crear plataforma
app.post("/platform/add", async (req, res) => {
	const newPlatform = req.body;

	await savePlatform(newPlatform);

	res.json({ success: true, message: "Plataforma creada" });
});

//Editar plataforma
app.put("/platform/edit", async (req, res) => {
	const updatedPlatform = req.body;

	await updatePlatform(
		updatedPlatform.id || updatedPlatform.Id,
		updatedPlatform
	);

	res.json({ success: true, message: "Plataforma editada" });
});

//Eliminar plataforma
app.delete("/platform/delete/:id", async (req, res) => {
	await deletePlatform(req.params.id);

	res.json({ success: true, message: "Plataforma borrada" });
});

//Obtener plataformas principales
app.get("/mainplatform/all", async (req, res) => {
	res.json(await getMainPlatforms());
});

//////////////////////////////////////////////////////////////////////////////	404   //////////////////////////////////////////////////////////////////////////////

app.use((req, res) => {
	res.render("404", {
		title: "",
		siteName: siteName,
		showMessage: false,
		subTitle: "Error 404",
		navBarItems: navBarMenu,
	});
});

//////////////////////////////////////////////////////////////////////////////	SERVER START    //////////////////////////////////////////////////////////////////////////////

//Inicio el servidor
app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

//////////////////////////////////////////////////////////////////////////////	BASE DE DATOS    //////////////////////////////////////////////////////////////////////////////

//Apertura de conexion
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

//////////////////////  	JUEGOS	   //////////////////////

//Obtener lista de juegos
async function getGamesList(shouldFormatDate) {
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
async function getGamesByName(name, shouldFormatDate) {
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
async function getGameById(id) {
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
async function getGamesByIdList(idsList) {
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
async function saveGame(newGame) {
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
async function updateGame(id, updatedGame) {
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
async function updateGameLikes(id, vote) {
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
async function deleteGame(id) {
	const connection = await openDbConnection();

	await deleteGenresFromGame(connection, id);

	await deletePlatformsFromGame(connection, id);

	let sql = "DELETE FROM `Games` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Cargar entidades relacionadas a una lista de juegos
async function getRelatedEntitesFromGames(games) {
	const gameIds = games.map((x) => x.Id);

	const gameGenres = await getGenresByGameId(gameIds);
	const gamePlatforms = await getPlatformsByGameId(gameIds);

	return { gameGenres, gamePlatforms };
}

//Borrar generos de un juego
async function deleteGenresFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "GenresPerGame");
}

//Borrar plataformas de un juego
async function deletePlatformsFromGame(connection, gameId) {
	await deleteRelatedToGame(connection, gameId, "PlatformsPerGame");
}

//Borrar entidad relacionada a un juego
async function deleteRelatedToGame(connection, gameId, tableName) {
	let sql = `DELETE FROM ${tableName} WHERE GameId = ?`;
	let values = [gameId];

	await connection.execute(sql, values);
}

//Obtener juegos segun plataforma principal
async function getGamesByMainPlatform(mainPlatformId) {
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
async function getGamesByGenreId(genreId) {
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
async function getGamesByPlatformId(platformId) {
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
async function getCommentsByGameId(gameId) {
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
async function saveComment(newComment) {
	const connection = await openDbConnection();
	const sql = `INSERT INTO Comments (GameId, UserName, PublishedDate, Text) VALUES (?, ?, NOW(), ?)`;
	const values = [newComment.gameId, newComment.userName, newComment.text];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar comentario
async function deleteComment(id) {
	const connection = await openDbConnection();
	const sql = "DELETE FROM Comments WHERE Id = ? LIMIT 1";
	const values = [id];

	await connection.execute(sql, values);
	await connection.end();
}

//////////////////////  	GENEROS	   //////////////////////

//Obtener lista de generos
async function getGenresList() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Genres order by Id";

	let [genres] = await connection.query(query);
	await connection.end();

	return genres;
}

//Obtener genero por id
async function getGenreById(id) {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Genres WHERE Id = ? LIMIT 1";

	let [genres] = await connection.query(query, [id]);
	await connection.end();

	return genres[0];
}

//Obtener generos segun una lista de ids de juegos
async function getGenresByGameId(gameIds) {
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

//Insertar genero
async function saveGenre(newGenre) {
	const connection = await openDbConnection();
	const sql = "INSERT INTO `Genres`(`Name`) VALUES (?)";
	const values = [newGenre.name || newGenre.Name];

	await connection.execute(sql, values);
	await connection.end();
}

//Actualizar genero
async function updateGenre(id, updatedGenre) {
	const connection = await openDbConnection();
	const sql = "UPDATE `Genres` SET `Name` = ? WHERE `Id` = ? LIMIT 1";
	const values = [updatedGenre.name || updatedGenre.Name, id];

	await connection.execute(sql, values);
	await connection.end();
}

//Eliminar genero
async function deleteGenre(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Genres` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Insertar relacion de generos a un juego
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

//////////////////////  	PLATAFORMAS	   //////////////////////

//Obtener lista de plataformas
async function getPlatformsList() {
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
async function getPlatformById(id) {
	const connection = await openDbConnection();
	const query = "SELECT * FROM Platforms WHERE Id = ? LIMIT 1";

	let [platforms] = await connection.query(query, [id]);
	await connection.end();

	return platforms[0];
}

//Obtener lista de plataformas principales
async function getMainPlatforms() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM `MainPlatforms` ORDER BY Id";

	let [platforms] = await connection.query(query);
	await connection.end();

	return platforms;
}

//Obtener plataformas segun una lista de juegos
async function getPlatformsByGameId(gameIds) {
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
async function savePlatform(newPlatform) {
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
async function updatePlatform(id, updatedPlatform) {
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
async function deletePlatform(id) {
	const connection = await openDbConnection();

	let sql = "DELETE FROM `Platforms` WHERE `Id` = ? LIMIT 1";
	let values = [id];

	await connection.execute(sql, values);

	await connection.end();
}

//Insertar relacion de plataformas a un juego
async function linkGameToPlatformsDb(gameId, platformsToLink) {
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

//////////////////////  	USUARIOS	   //////////////////////

//Validar que usuario es valido
async function isUserValid(username, password) {
	const connection = await openDbConnection();

	const sql = "SELECT 1 FROM `Users` WHERE `UserName` = ? AND `Password` = ?";
	const values = [username, password];

	const [result] = await connection.execute(sql, values);
	await connection.end();

	return result[0] !== undefined;
}

//////////////////////////////////////////////////////////////////////////////	CONSTRUCCION DE CONTENIDO    //////////////////////////////////////////////////////////////////////////////

//Items del NavBar
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

//Formateo de fecha para juegos
function setGameListDateFormat(games) {
	games = games.map((currentGame) => {
		currentGame.LaunchDate = getCorrectDateFormat(currentGame.LaunchDate);
		return currentGame;
	});

	return games;
}

//Formateo de fechas
function getCorrectDateFormat(unformattedDate) {
	const date = new Date(unformattedDate);
	return date.toLocaleDateString("es-ES").replaceAll(/\//g, "-");
}

//Convierte string separado por comas en array
function arrayToString(array) {
	return array.join(",");
}

//Armado de objeto complejo de juego con entidades relacionadas
async function composeGames(games, gameGenres, gamePlatforms) {
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

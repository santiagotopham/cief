//Inicializo aplicacion
import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import morgan from "morgan";
import mysql from "mysql2/promise";

const app = express();

//Configuro la aplicacion
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

//Disponibilizo rutas
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

// app.get("/year/:year", async (req, res) => {
// 	let movies = await filterByYear(req.params.year);

// 	if (movies.length == 0) {
// 		return res.redirect("/404");
// 	}

// 	res.render("search", {
// 		title: siteName,
// 		siteName: siteName,
// 		subTitle: `Películas del año: ${req.params.year}`,
// 		navBarItems: navBarMenu,
// 		movies: movies,
// 	});
// });

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

//Panel admin
app.get("/admin", async (req, res) => {
	res.render("admin", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "admin",
		navBarItems: navBarMenu,
		games: await getGamesFromDb(false),
		genres: await getGenresFromDb(),
		platforms: await getPlatformsFromDb(),
	});
});

app.post("/game/add", async (req, res) => {
	const newGame = req.body;

	await saveGameToDb(newGame);

	res.redirect("/admin");
});

// app.post("/game/edit", async (req, res) => {
// 	const updatedMovie = req.body;

// 	await updateMovie(updatedMovie.id, updatedMovie);

// 	res.redirect("/admin");
// });

app.delete("/game/delete/:id", async (req, res) => {
	const id = req.params.id;

	await deleteGame(id);

	res.redirect("/admin");
});

//Error 404 handling
app.use((req, res) => {
	res.render("404", {
		title: "Error 404",
		siteName: siteName,
		subTitle: "Error 404",
		navBarItems: navBarMenu,
	});
});

//Server startup
app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

//Data management
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

//Retrieve games
async function getGamesFromDb(shouldFormatDate) {
	const connection = await openDbConnection();
	const query = `select * from Games g`;

	let [games] = await connection.query(query);
	await connection.end();

	const gameIds = games.map((x) => x.Id);
	const gameGenres = await getGenresByGameIdFromDb(gameIds);
	const gamePlatforms = await getPlatformsByGameIdFromDb(gameIds);

	games = games.map((currentGame) => {
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

	if (shouldFormatDate) {
		games = setGameListDateFormat(games);
	}

	return games;
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

// async function filterByYear(year) {
// 	const moviesDB = await getMoviesFromDb();
// 	return moviesDB.filter((x) => x.year == year);
// }

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

	await linkGameToGenresDb(result[0].insertId, newGame.selectedGenresIds);
	await linkGameToPlatformsDb(
		result[0].insertId,
		newGame.selectedPlatformsIds
	);

	await connection.end();
}

async function linkGameToGenresDb(gameId, genresId) {
	const connection = await openDbConnection();

	const genreArray =
		typeof genresId === "string"
			? genresId
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: genresId;

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

async function linkGameToPlatformsDb(gameId, platformIds) {
	const connection = await openDbConnection();

	const platformArray =
		typeof platformIds === "string"
			? platformIds
					.split(",")
					.map((id) => parseInt(id.trim()))
					.filter(Boolean)
			: platformIds;

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

// async function updateMovie(id, updatedMovie) {
// 	const connection = await openDbConnection();
// 	const sql =
// 		"UPDATE `films` SET `title` = ?, `image_url` = ?, `year` = ?, `director` = ?, `genre` = ?, `budget` = ?, `synopsis` = ? WHERE `Id` = ? LIMIT 1";
// 	const values = [
// 		updatedMovie.title,
// 		updatedMovie.image_url,
// 		updatedMovie.year,
// 		updatedMovie.director,
// 		updatedMovie.genre,
// 		updatedMovie.budget,
// 		updatedMovie.synopsis,
// 		id,
// 	];

// 	await connection.execute(sql, values);
// 	await connection.end();
// }

async function deleteGame(id) {
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

	console.log(sql);
	console.log(values);

	let result = await connection.execute(sql, values);
	console.log(result[0]);
}

//Content building
function buildNavBarMenu() {
	let list = '<ul class="container">';
	for (const currentPlatform of mainPlatforms) {
		list += `<li><a href="/mainplatform/${currentPlatform.Name.toLowerCase()}">${
			currentPlatform.Name
		}</a></li>`;
	}
	// list += '<li><a href="/backoffice">Backoffice</a></li></ul>';
	return list;
}

// function buildMovieList(movies) {
// 	if (movies.length == 0) {
// 		return null;
// 	}

// 	let list = "<ul>";
// 	for (const currentMovie of movies) {
// 		list += `<li>${currentMovie.title}</li>`;
// 	}
// 	list += "</ul>";
// 	return list;
// }

// function buildByGenre(genre) {
// 	let movies = filterByGenre(genre);
// 	return buildMovieList(movies);
// }

// function buildByYear(year) {
// 	let movies = filterByYear(year);
// 	return buildMovieList(movies);
// }

//Auxiliar methods
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

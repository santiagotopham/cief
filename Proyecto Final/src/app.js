import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import morgan from "morgan";
import {
	getGamesList,
	getGamesByName,
	getGameById,
	saveGame,
	updateGame,
	updateGameLikes,
	deleteGame,
	getGamesByMainPlatform,
	getGamesByGenreId,
	getGamesByPlatformId,
	getCommentsByGameId,
	saveComment,
	deleteComment,
} from "../services/games.service.js";
import {
	getGenresList,
	getGenreById,
	saveGenre,
	updateGenre,
	deleteGenre,
} from "../services/genres.service.js";
import {
	getPlatformsList,
	getPlatformById,
	getMainPlatforms,
	savePlatform,
	updatePlatform,
	deletePlatform,
} from "../services/platforms.service.js";
import { isUserValid } from "../services/users.service.js";

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

//Login
app.get("/login", (req, res) => {
	res.render("login", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "Login",
		navBarItems: navBarMenu,
	});
});

//Iniciar sesion
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const isValid = await isUserValid(username, password);

		if (isValid) {
			res.json({ success: true, message: "Login exitoso" });
		} else {
			res.status(401).json({
				success: false,
				message: "Credenciales inválidas",
			});
		}
	} catch (error) {
		console.error("Error en login:", error);
		res.status(500).json({ success: false, message: "Error del servidor" });
	}
});

//Panel
app.get("/admin", async (req, res) => {
	res.render("admin", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "",
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

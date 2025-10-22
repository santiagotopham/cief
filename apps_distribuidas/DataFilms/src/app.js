//Inicializo la aplicacion
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const app = express();

//Configuro la aplicacion
process.loadEnvFile();
const PORT = process.env.PORT;
const moviesTable = "films";
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

//Seteo la parametrizacion de datos inicial
let siteName = "DataFilms";
let movieGenres = await getGenresList();
let navBarMenu = buildNavBarMenu();

//Configuro rutas posible
app.get("/", async (req, res) => {
	res.render("index", {
		title: siteName,
		siteName: siteName,
		subTitle: "Todas las películas",
		navBarItems: navBarMenu,
		movies: await getMoviesFromDb(),
	});
});

for (const currentGenre of movieGenres) {
	app.get(`/genre/${currentGenre.toLocaleLowerCase()}`, async (req, res) => {
		res.render("search", {
			title: siteName,
			siteName: siteName,
			subTitle: `Películas del género: ${currentGenre}`,
			navBarItems: navBarMenu,
			movies: await filterByGenre(currentGenre),
		});
	});
}

app.get("/year/:year", async (req, res) => {
	let movies = await filterByYear(req.params.year);

	if (movies.length == 0) {
		return res.redirect("/404");
	}

	res.render("search", {
		title: siteName,
		siteName: siteName,
		subTitle: `Películas del año: ${req.params.year}`,
		navBarItems: navBarMenu,
		movies: movies,
	});
});

app.get("/movie/:id", async (req, res) => {
	let movie = await getMovieById(req.params.id);

	if (movie == null) {
		return res.redirect("/404");
	}

	res.render("result", {
		title: siteName,
		siteName: siteName,
		subTitle: movie.title,
		navBarItems: navBarMenu,
		movie: movie,
	});
});

//Manejo error 404
app.use((req, res) => {
	res.render("404", {
		title: "Error 404",
		siteName: siteName,
		subTitle: "Error 404",
		navBarItems: navBarMenu,
	});
});

//Inicio el servidor
app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

//Gestion de datos
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

async function getMoviesFromDb() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM films";

	const [movies] = await connection.query(query);
	await connection.end();

	return movies;
}

async function getGenresList() {
	const connection = await openDbConnection();
	const query = "SELECT distinct genre FROM films";

	let [genres] = await connection.query(query);
	await connection.end();
	genres = genres.map((x) => x.genre);

	return genres;
}

async function filterByGenre(genre) {
	const moviesDB = await getMoviesFromDb();
	return moviesDB.filter((x) => x.genre == genre);
}

async function filterByYear(year) {
	const moviesDB = await getMoviesFromDb();
	return moviesDB.filter((x) => x.year == year);
}

async function getMovieById(id) {
	const connection = await openDbConnection();
	const query = `SELECT * FROM films where Id = ${id}`;

	const [movies] = await connection.query(query);
	await connection.end();

	return movies[0];
}

//Construccion de contenido
function buildNavBarMenu() {
	let list = '<ul class="container">';
	for (const currentGenre of movieGenres) {
		list += `<li><a href="/genre/${currentGenre.toLowerCase()}">${currentGenre}</a></li>`;
	}
	list += "</ul>";
	return list;
}

function buildMovieList(movies) {
	if (movies.length == 0) {
		return null;
	}

	let list = "<ul>";
	for (const currentMovie of movies) {
		list += `<li>${currentMovie.title}</li>`;
	}
	list += "</ul>";
	return list;
}

function buildByGenre(genre) {
	let movies = filterByGenre(genre);
	return buildMovieList(movies);
}

function buildByYear(year) {
	let movies = filterByYear(year);
	return buildMovieList(movies);
}

//Inicializo la aplicacion
const express = require("express");
const morgan = require("morgan");
const path = require("node:path");

const app = express();

//Configuro la aplicacion
process.loadEnvFile();
const PORT = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Seteo la parametrizacion de datos
let siteName = "DataFilms";
let moviesDB = require("../data/pelis.json");
let movieGenres = getGenresList();
let navBarMenu = buildNavBarMenu();

//Configuro rutas posible
app.get("/", (req, res) => {
	res.render("index", {
		title: siteName,
		siteName: siteName,
		subTitle: "Todas las películas",
		navBarItems: navBarMenu,
	});
});

movieGenres.forEach((currentGenre) => {
	app.get(`/genre/${currentGenre.toLocaleLowerCase()}`, (req, res) => {
		res.render("search", {
			title: siteName,
			siteName: siteName,
			subTitle: `Películas del género: ${currentGenre}`,
			navBarItems: navBarMenu,
			movies: buildByGenre(currentGenre),
		});
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
function getGenresList() {
	let movieGenres = moviesDB.map((movie) => {
		return movie.genre;
	});
	let tempCat = new Set(movieGenres);
	return [...tempCat];
}

function filterByGenre(genre) {
	return moviesDB.filter((x) => x.genre == genre);
}

function filterByYear(year) {
	return moviesDB.filter((x) => x.year == year);
}

//Construccion de contenido
function buildNavBarMenu() {
	let list = '<ul class="container">';
	movieGenres.forEach((currentGenre) => {
		list += `<li><a href="/genre/${currentGenre.toLocaleLowerCase()}">${currentGenre}</a></li>`;
	});
	list += "</ul>";
	return list;
}

function buildMovieList(movies) {
	let list = "<ul>";
	movies.forEach((currentMovie) => {
		list += `<li>${currentMovie.title}</li>`;
	});
	list += "</ul>";
	return list;
}

function buildByGenre(genre) {
	let movies = filterByGenre(genre);
	return buildMovieList(movies);
}

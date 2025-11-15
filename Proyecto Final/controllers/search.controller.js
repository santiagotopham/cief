import {
	getGamesByName,
	getGamesByGenreId,
	getGamesByPlatformId,
	getGamesByMainPlatform,
} from "../services/games.service.js";
import { getGenreById } from "../services/genres.service.js";
import {
	getPlatformById,
	getMainPlatformByName,
} from "../services/platforms.service.js";
import { buildNavBarMenu } from "../services/common.service.js";
import { siteName } from "../config/constants.js";

// Buscador por nombre
export async function searchByName(req, res) {
	const games = await getGamesByName(req.params.name);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${req.params.name}`,
		navBarItems: await buildNavBarMenu(),
		games: games,
	});
}

// Buscador por genero
export async function searchByGenre(req, res) {
	const games = await getGamesByGenreId(req.params.id);
	const genre = await getGenreById(req.params.id);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${genre.Name}`,
		navBarItems: await buildNavBarMenu(),
		games: games,
	});
}

// Buscador por plataforma
export async function searchByPlatform(req, res) {
	const games = await getGamesByPlatformId(req.params.id);
	const platform = await getPlatformById(req.params.id);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Busqueda: ${platform.Name}`,
		navBarItems: await buildNavBarMenu(),
		games: games,
	});
}

// Categorias del Navbar (por plataforma principal/padre)
export async function searchByMainPlatform(req, res) {
	const mainPlatform = await getMainPlatformByName(req.params.name);
	const games = await getGamesByMainPlatform(mainPlatform.Id);

	res.render("search", {
		title: siteName,
		siteName: siteName,
		showMessage: true,
		subTitle: `Juegos de: ${mainPlatform.Name}`,
		navBarItems: await buildNavBarMenu(),
		games: games,
	});
}

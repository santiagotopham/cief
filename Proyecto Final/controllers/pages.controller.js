import {
	getGamesList,
	getById,
	getRelatedEntitesFromGames,
	composeGames,
} from "../services/games.service.js";
import {
	getCorrectDateFormat,
	buildNavBarMenu,
} from "../services/common.service.js";
import { siteName } from "../config/constants.js";

export async function renderHome(req, res) {
	try {
		const games = await getGamesList(true);

		res.render("index", {
			title: siteName,
			siteName: siteName,
			showMessage: true,
			subTitle: "Collecion de juegos",
			navBarItems: await buildNavBarMenu(),
			games: games,
		});
	} catch (err) {
		console.error("Error cargando home:", err);
		res.status(500).send("Error cargando la página principal");
	}
}

export async function renderGamePage(req, res) {
	try {
		const id = req.params.id;

		// Obtener el juego desde la DB (service)
		let games = await getById(id);

		if (!games || games.length === 0) {
			return res.redirect("/404");
		}

		// Obtener géneros y plataformas asociados
		const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
			games
		);

		// Componer objeto final
		games = await composeGames(games, gameGenres, gamePlatforms);

		// Formatear fecha
		games[0].LaunchDate = getCorrectDateFormat(games[0].LaunchDate);

		// Renderizar la vista del detalle
		return res.render("game_page", {
			title: siteName,
			siteName: siteName,
			showMessage: true,
			subTitle: games[0].Title,
			navBarItems: await buildNavBarMenu(),
			game: games[0],
		});
	} catch (error) {
		console.error("Error en renderGamePage:", error);
		return res.redirect("/404");
	}
}

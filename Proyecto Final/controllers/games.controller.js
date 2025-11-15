import {
	getById,
	getRelatedEntitesFromGames,
	composeGames,
	saveGame,
	updateGame,
	deleteGame,
	updateGameLikes,
} from "../services/games.service.js";
import {
	getCorrectDateFormat,
	buildNavBarMenu,
} from "../services/common.service.js";
import { siteName } from "../config/constants.js";

//Obtener por id
export async function getGameById(req, res) {
	try {
		const id = req.params.id;

		let games = await getById(id);

		if (!games || games.length === 0) {
			return res.redirect("/404");
		}

		const { gameGenres, gamePlatforms } = await getRelatedEntitesFromGames(
			games
		);

		games = await composeGames(games, gameGenres, gamePlatforms);

		games[0].LaunchDate = getCorrectDateFormat(games[0].LaunchDate);

		return res.render("game_page", {
			title: siteName,
			siteName: siteName,
			showMessage: true,
			subTitle: games[0].Title,
			navBarItems: await buildNavBarMenu(),
			game: games[0],
		});
	} catch (error) {
		console.error("Error en getGameById:", error);
		return res.redirect("/404");
	}
}

//Nuevo
export async function createGame(req, res) {
	await saveGame(req.body);
	res.json({ success: true, message: "Juego creado" });
}

//Editar
export async function editGame(req, res) {
	await updateGame(req.body.id || req.body.Id, req.body);
	res.json({ success: true, message: "Juego editado" });
}

//Eliminar
export async function removeGame(req, res) {
	await deleteGame(req.params.id);
	res.json({ success: true, message: "Juego borrado" });
}

//Votar
export async function voteGame(req, res) {
	const { vote } = req.body;

	if (vote !== 1 && vote !== -1)
		return res
			.status(400)
			.json({ success: false, message: "Voto inválido" });

	const updatedLikes = await updateGameLikes(req.params.gameId, vote);

	res.json({
		success: true,
		message: "Voto aceptado",
		ThumbsUpCounter: updatedLikes,
	});
}

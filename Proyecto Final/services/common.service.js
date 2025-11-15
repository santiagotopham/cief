import { getMainPlatforms } from "../services/platforms.service.js";

//Formateo de fecha para juegos
export function setGameListDateFormat(games) {
	games = games.map((currentGame) => {
		currentGame.LaunchDate = getCorrectDateFormat(currentGame.LaunchDate);
		return currentGame;
	});

	return games;
}

//Formateo de fechas
export function getCorrectDateFormat(unformattedDate) {
	const date = new Date(unformattedDate);
	return date.toLocaleDateString("es-ES").replaceAll(/\//g, "-");
}

//Convierte string separado por comas en array
export function arrayToString(array) {
	return array.join(",");
}

//Items del NavBar
export async function buildNavBarMenu() {
	let mainPlatforms = await getMainPlatforms();
	let list = '<ul class="container">';
	for (const currentPlatform of mainPlatforms) {
		list += `<li><a href="/mainplatform/${currentPlatform.Name.toLowerCase()}">${
			currentPlatform.Name
		}</a></li>`;
	}
	return list;
}

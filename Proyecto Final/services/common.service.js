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

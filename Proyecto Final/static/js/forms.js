//////////////////////////////////////////////////////////////////////////////	FORMULARIOS	/////////////////////////////////////////////////////////////////////////////

//////////////////////  	JUEGOS	   //////////////////////

//Cargo formulario de edicion de juegos
function loadAndShowGameEditForm(game) {
	isInsert = false;
	resetGameForm();

	game = JSON.parse(game);

	document.getElementById("gameModalTitle").textContent = "Editar Juego";
	document.getElementById("gameId").value = game.Id;
	document.getElementById("gameTitle").value = game.Title;
	document.getElementById("gameImageUrl").value = game.ImageUrl;
	document.getElementById("gameLaunchDate").value = getCorrectDateFormat(
		game.LaunchDate
	);
	document.getElementById("gameDeveloper").value = game.Developer;

	for (const input of document.querySelectorAll('input[name="category"]')) {
		input.checked = input.value === game.Category;
	}

	document.getElementById("gameSynopsis").value = game.Synopsis;

	loadEditChipItems(
		game.Genres,
		selectedGenresMap,
		"gameGenres",
		addGenresFromSelect
	);

	loadEditChipItems(
		game.Platforms,
		selectedPlatformsMap,
		"gamePlatforms",
		addPlatformsFromSelect
	);

	openModal("gameModal");
}

//Limpia formulario de juegos
function resetGameForm() {
	cleanMaps();

	for (const currentSelector of document.querySelectorAll(
		"select[multiple]"
	)) {
		for (const currentOption of currentSelector.options) {
			currentOption.selected = false;
		}
	}

	for (const div of document.querySelectorAll(".chips_container")) {
		div.innerHTML = "";
	}

	for (const input of document.querySelectorAll('input[type="hidden"]')) {
		input.value = "";
	}
}

//Agrego generos desde el selector
function addGenresFromSelect() {
	let selectorName = "";
	let selectedList = "";

	selectorName = "gameGenres";
	selectedList = "selectedGenresList";

	addFromSelectorToMap(selectedGenresMap, selectorName);

	renderSelectedMap(selectedGenresMap, selectedList, "removeGenre");
}

//Borro genero selecionado
function removeGenre(id) {
	selectedGenresMap.delete(String(id));
	let selectorName = "gameGenres";
	let selectedList = "selectedGenresList";

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedGenresMap, selectedList, "removeGenre");
}

//Agrego plataformas desde el selector
function addPlatformsFromSelect() {
	let selectorName = "gamePlatforms";
	let selectedList = "selectedPlatformsList";

	addFromSelectorToMap(selectedPlatformsMap, selectorName);
	renderSelectedMap(selectedPlatformsMap, selectedList, "removePlatform");
}

//Borro plataforma selecionada
function removePlatform(id) {
	selectedPlatformsMap.delete(String(id));
	let selectorName = "gamePlatforms";
	let selectedList = "selectedPlatformsList";

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedPlatformsMap, selectedList, "removePlatform");
}

//////////////////////  	GENEROS	   //////////////////////

//Cargo formulario de edicion de generos
function editGenre(id, name) {
	isInsert = false;
	document.getElementById("genreId").value = id;
	document.getElementById("genreName").value = name;
	document.getElementById("genreModalTitle").textContent = "Editar Género";
	openModal("genreModal");
}

//////////////////////  	PLATAFORMAS	   //////////////////////

//Cargo formulario de edicion de plataformas
function editPlatform(id, name, mainPlatformId) {
	isInsert = false;
	document.getElementById("platformId").value = id;
	document.getElementById("platformName").value = name;
	document.getElementById("platformMainPlatform").value =
		mainPlatformId || "";
	document.getElementById("platformModalTitle").textContent =
		"Editar Plataforma";
	openModal("platformModal");
}

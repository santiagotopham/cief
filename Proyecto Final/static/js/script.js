//////////////////////////////////////////////////////////////////////////////	CONFIGURACIONES INICIALES	/////////////////////////////////////////////////////////////////////////////
// Key = Id, Value = Name
const selectedGenresMap = new Map();
const selectedPlatformsMap = new Map();

const gameForm = document.getElementById("gameForm");
const genreForm = document.getElementById("genreForm");
const platformForm = document.getElementById("platformForm");

let isLoggedIn = false;
let isInsert = true;
let filtersOpen = false;

//////////////////////////////////////////////////////////////////////////////	CARGO EVENTOS	/////////////////////////////////////////////////////////////////////////////

//Seteo eventos
document.addEventListener("DOMContentLoaded", async () => {
	if (gameForm) {
		gameForm.addEventListener("reset", () => {
			resetGameForm();
		});

		addListenerById("addGenresBtn", addGenresFromSelect, "click");
		addListenerById("updateAddGenresBtn", addGenresFromSelect, "click");
		addListenerById("addPlatformsBtn", addPlatformsFromSelect, "click");
		addListenerById(
			"updateAddPlatformsBtn",
			addPlatformsFromSelect,
			"click"
		);
		addListenerById("gameForm", handleGameFormSubmit, "submit");
		addListenerById("genreForm", handleGenreFormSubmit, "submit");
		addListenerById("platformForm", handlePlatformFormSubmit, "submit");

		loadGenres();
		loadPlatforms();
	}

	document.addEventListener("click", (e) => {
		const filtersContainer = document.querySelector(".filters_container");
		if (!filtersContainer.contains(e.target) && filtersOpen) {
			toggleFilters();
		}
	});

	const commentForm = addListenerById(
		"commentForm",
		handleCommentFormSubmit,
		"submit"
	);

	if (commentForm) {
		const gameId = document.getElementById("commentGameId").value;
		loadComments(gameId);
	}

	await loadFilters();
});

//Agrega evento a item de html
function addListenerById(elementId, callback, event) {
	const element = document.getElementById(elementId);
	if (element) element.addEventListener(event, callback);
	return element;
}

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

//////////////////////////////////////////////////////////////////////////////	MODALES	/////////////////////////////////////////////////////////////////////////////

//////////////////////  	JUEGOS	   //////////////////////

//Abro modal de juegos
function openGameModal(mode) {
	if (mode === "add") {
		isInsert = true;
		gameForm.reset();
		document.getElementById("gameModalTitle").textContent = "Nuevo Juego";
		resetGameForm();
	}

	openModal("gameModal");
}

//////////////////////  	GENEROS	   //////////////////////

//Abro modal de generos
function openGenreModal(mode) {
	if (mode === "add") {
		isInsert = true;
		genreForm.reset();
		document.getElementById("genreModalTitle").textContent = "Nuevo Género";
		document.getElementById("genreId").value = "";
	}

	openModal("genreModal");
}

//////////////////////  	PLATAFORMAS	   //////////////////////

//Abro modal de plataformas
function openPlatformModal(mode) {
	if (mode === "add") {
		isInsert = true;
		platformForm.reset();
		document.getElementById("platformModalTitle").textContent =
			"Nueva Plataforma";
		document.getElementById("platformId").value = "";
		document.getElementById("platformMainPlatform").value = "";
	}

	openModal("platformModal");
}

//////////////////////  	AUX	   //////////////////////

//Abro modal
function openModal(modalName) {
	document.getElementById(modalName).classList.add("active");
}

//Cierro modal
function closeModal(modalName) {
	document.getElementById(modalName).classList.remove("active");
}

// Cerrar modal al clickear afuera
globalThis.onclick = function (event) {
	if (event.target === document.getElementById("gameModal")) {
		closeModal("gameModal");
	}
	if (event.target === document.getElementById("genreModal")) {
		closeModal("genreModal");
	}
	if (event.target === document.getElementById("platformModal")) {
		closeModal("platformModal");
	}
};

//////////////////////////////////////////////////////////////////////////////	BACKEND	/////////////////////////////////////////////////////////////////////////////

//////////////////////  	JUEGOS	   //////////////////////

//Envio form de juego al backend
async function handleGameFormSubmit(e) {
	e.preventDefault();

	const gameData = {
		id: document.getElementById("gameId").value,
		title: document.getElementById("gameTitle").value.trim(),
		imageUrl: document.getElementById("gameImageUrl").value.trim(),
		launchDate: document.getElementById("gameLaunchDate").value,
		developer: document.getElementById("gameDeveloper").value.trim(),
		category: document.querySelector('input[name="category"]:checked')
			.value,
		synopsis: document.getElementById("gameSynopsis").value.trim(),
		genres: Array.from(selectedGenresMap.keys()),
		platforms: Array.from(selectedPlatformsMap.keys()),
	};

	try {
		const url = gameData.id ? "/game/edit" : "/game/add";
		const response = await fetch(url, {
			method: gameData.id ? "PUT" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(gameData),
		});

		if (!response.ok) throw new Error("Error al guardar el juego");

		const data = await response.json();
		showToast(data.message);

		closeModal("gameModal");
		setTimeout(() => location.reload(), 1000);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al guardar el juego", true);
	}
}

//Envio borrado de juego al backend
function deleteGame(id) {
	if (!confirm("¿Estás seguro de que quieres eliminar este juego?")) return;

	fetch(`/game/delete/${id}`, {
		method: "DELETE",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error al eliminar el juego");
			}
			return response.json();
		})
		.then((data) => {
			showToast(data.message || "Juego eliminado correctamente");
			setTimeout(() => location.reload(), 1000);
		})
		.catch((error) => {
			console.error("Error:", error);
			showToast("Error al eliminar el juego", true);
		});
}

//Envio de busqueda por nombre al backend
function searchGame(event) {
	event.preventDefault();
	const input = document.getElementById("searchInput");
	const name = input.value.trim();
	if (name) {
		globalThis.location.href = `/search/${encodeURIComponent(name)}`;
	}
	return false;
}

//Envio de votacion al backend
async function voteGame(gameId, vote) {
	try {
		const res = await fetch(`/game/vote/${gameId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				vote: vote,
			}),
		});

		if (!res.ok) {
			showToast("Error al votar");
			return;
		}

		const data = await res.json();
		if (data.ThumbsUpCounter !== undefined) {
			document.getElementById("thumbsCounter").textContent =
				data.ThumbsUpCounter;
		}

		showToast("Votado");
	} catch (error) {
		showToast("Error al votar");
		console.error("Error:", error);
	}
}

//////////////////////  	COMENTARIOS	   //////////////////////

//Carga de comentarios segun juego desde el backend
async function loadComments(gameId) {
	try {
		const response = await fetch(`/comment/game/${gameId}`);
		if (!response.ok) throw new Error("Error al cargar comentarios");

		const comments = await response.json();
		renderComments(comments);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al cargar los comentarios", true);
	}
}

//Envio form de comentarios al backend
async function handleCommentFormSubmit(e) {
	e.preventDefault();

	const gameId = document.getElementById("commentGameId").value;
	const userName = document.getElementById("commentUserName").value.trim();
	const text = document.getElementById("commentText").value.trim();

	try {
		const response = await fetch("/comment/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ gameId, userName, text }),
		});

		if (!response.ok) throw new Error("Error al guardar comentario");

		const data = await response.json();
		showToast(data.message);

		document.getElementById("commentUserName").value = "";
		document.getElementById("commentText").value = "";

		await loadComments(gameId);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al guardar el comentario", true);
	}
}

//Envio borrado de comentario al backend
async function deleteComment(id, gameId) {
	if (!confirm("¿Eliminar este comentario?")) return;

	try {
		const response = await fetch(`/comment/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) throw new Error("Error al eliminar comentario");

		const data = await response.json();
		showToast(data.message);

		await loadComments(gameId);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al eliminar el comentario", true);
	}
}

//////////////////////  	GENEROS	   //////////////////////

//Carga de generos desde backend
async function loadGenres() {
	try {
		const response = await fetch("/genre/all");
		if (!response.ok) throw new Error("Error al cargar generos");
		const data = await response.json();

		buildGenresTables("genresTableBody", data);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al cargar los generos", true);
	}
}

//Envio form de generos al backend
async function handleGenreFormSubmit(e) {
	e.preventDefault();

	const id = document.getElementById("genreId").value;
	const name = document.getElementById("genreName").value.trim();

	if (!name) return;

	try {
		let response;
		if (id) {
			response = await fetch("/genre/edit", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, name }),
			});
		} else {
			response = await fetch("/genre/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
		}

		if (!response.ok) throw new Error("Error al guardar género");

		const data = await response.json();
		showToast(data.message);

		closeModal("genreModal");
		setTimeout(() => location.reload(), 1000);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al guardar el género", true);
	}
}

//Envio borrado de genero al backend
async function deleteGenre(id) {
	if (!confirm("¿Eliminar este género?")) return;

	try {
		const response = await fetch(`/genre/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) throw new Error("Error al eliminar género");

		const data = await response.json();
		showToast(data.message || "Género eliminado correctamente");

		setTimeout(() => location.reload(), 1000);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al eliminar el género", true);
	}
}

//////////////////////  	PLATAFORMAS	   //////////////////////

//Carga de plataformas desde el backend
async function loadPlatforms() {
	try {
		const response = await fetch("/platform/all");
		if (!response.ok) throw new Error("Error al cargar plataformas");

		const data = await response.json();

		buildPlatformsTable("platformsTableBody", data);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al cargar las plataformas", true);
	}
}

//Envio form de plataformas al backend
async function handlePlatformFormSubmit(e) {
	e.preventDefault();

	const id = document.getElementById("platformId").value;
	const name = document.getElementById("platformName").value.trim();
	const mainPlatformId = document.getElementById(
		"platformMainPlatform"
	).value;

	if (!name || !mainPlatformId) {
		showToast("Por favor completa todos los campos", true);
		return;
	}

	try {
		let response;
		if (id) {
			response = await fetch("/platform/edit", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, name, mainPlatformId }),
			});
		} else {
			response = await fetch("/platform/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, mainPlatformId }),
			});
		}

		if (!response.ok) throw new Error("Error al guardar plataforma");

		const data = await response.json();
		showToast(
			data.message ||
				(id
					? "Plataforma actualizada correctamente"
					: "Plataforma creada correctamente")
		);

		closeModal("platformModal");
		setTimeout(() => location.reload(), 1000);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al guardar la plataforma", true);
	}
}

//Envio borrado de plataforma al backend
async function deletePlatform(id) {
	if (!confirm("¿Eliminar esta plataforma?")) return;

	try {
		const response = await fetch(`/platform/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) throw new Error("Error al eliminar plataforma");

		const data = await response.json();
		showToast(data.message || "Plataforma eliminada correctamente");

		setTimeout(() => location.reload(), 1000);
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al eliminar la plataforma", true);
	}
}

//////////////////////  	FILTROS	   //////////////////////

//Cargado de filtros
async function loadFilters() {
	try {
		const genresResponse = await fetch("/genre/all");
		const genres = await genresResponse.json();

		buildFilterList("genresList", genres, "genre");

		const platformsResponse = await fetch("/platform/all");
		const platforms = await platformsResponse.json();

		buildFilterList("platformsList", platforms, "platform");
	} catch (error) {
		console.error("Error cargando filtros:", error);
	}
}

//////////////////////////////////////////////////////////////////////////////	CONSTRUCCION DE CONTENIDO	/////////////////////////////////////////////////////////////////////////////

//Construye listado de chips
function renderSelectedMap(selectedMap, renderDivId, removeFnName) {
	const containerDiv = document.getElementById(renderDivId);

	if (!containerDiv) return;

	containerDiv.innerHTML = "";

	for (const currentItem of selectedMap) {
		const chip = createChip(currentItem[1], currentItem[0], removeFnName);
		containerDiv.appendChild(chip);
	}
}

//Construye chip
function createChip(text, id = null, removeFnName = null) {
	const chip = document.createElement("span");
	chip.className = "item_chip";

	chip.innerHTML = `${text} `;

	if (id && removeFnName)
		chip.innerHTML += `<button type="button" class="remove_chip" onclick="${removeFnName}(${id})">×</button>`;

	return chip;
}

//Creo notificaciones Toast
function showToast(message, isError = false) {
	const toast = document.createElement("div");
	toast.className = `toast ${isError ? "error" : ""}`;
	toast.textContent = message;

	document.body.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, 3000);
}

//Construye lista de comentarios
function renderComments(comments) {
	const container = document.getElementById("commentsContainer");

	if (!container) return;

	if (comments.length === 0) {
		container.innerHTML =
			'<p class="no_comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
		return;
	}

	container.innerHTML = "";

	for (const comment of comments) {
		const commentDiv = document.createElement("div");
		commentDiv.className = "comment_item";
		commentDiv.innerHTML = `
			<div class="comment_header">
				<span class="comment_author">${comment.UserName}</span>
				<span class="comment_date">${comment.PublishedDate}</span>
			</div>
			<p class="comment_text">${comment.Text}</p>
			<button class="comment_delete_btn" onclick="deleteComment(${comment.Id}, ${comment.GameId})" title="Eliminar comentario">
				×
			</button>
		`;
		container.appendChild(commentDiv);
	}
}

//Construye lista de filtros
function buildFilterList(htmlListId, items, path) {
	const htmlList = document.getElementById(htmlListId);

	htmlList.innerHTML = items
		.map(
			(currentItem) =>
				`<li><a href="/search/${path}/${currentItem.Id}">${currentItem.Name}</a></li>`
		)
		.join("");
}

//Construye tabla de generos
function buildGenresTables(tableId, genres) {
	const table = document.getElementById(tableId);
	table.innerHTML = "";

	for (const currentGenre of genres) {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${currentGenre.Id}</td>
			<td>${currentGenre.Name}</td>
			<td>
				<button onclick="editGenre(${currentGenre.Id}, '${currentGenre.Name}')">Editar</button>
				<button onclick="deleteGenre(${currentGenre.Id})">Eliminar</button>
			</td>`;
		table.appendChild(tr);
	}
}

//Construye tabla de plataformas
function buildPlatformsTable(tableId, platforms) {
	const table = document.getElementById(tableId);
	table.innerHTML = "";

	for (const currentPlatform of platforms) {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${currentPlatform.Id}</td>
			<td>${currentPlatform.Name}</td>
			<td>${currentPlatform.MainPlatformName || "N/A"}</td>
			<td>
				<button onclick="editPlatform(${currentPlatform.Id}, '${
			currentPlatform.Name
		}', ${currentPlatform.MainPlatformId})">Editar</button>
				<button onclick="deletePlatform(${currentPlatform.Id})">Eliminar</button>
			</td>`;
		table.appendChild(tr);
	}
}

//////////////////////////////////////////////////////////////////////////////	METODOS AUXILIARES	/////////////////////////////////////////////////////////////////////////////

//Formateo de fechas
function getCorrectDateFormat(unformattedDate) {
	if (!unformattedDate) return "";

	if (/^\d{4}-\d{2}-\d{2}$/.test(unformattedDate)) {
		return unformattedDate;
	}

	const date = new Date(unformattedDate);

	if (isNaN(date.getTime())) {
		console.error("Fecha inválida:", unformattedDate);
		return "";
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

//Carga chips en form de edicion de juegos
function loadEditChipItems(itemsArray, selectedMap, selectorName, callback) {
	if (itemsArray && Array.isArray(itemsArray)) {
		selectedMap.clear();

		for (const currentItem of itemsArray) {
			toggleOptionInSelector(selectorName, currentItem.Id, true);
		}

		callback();
	}
}

//Agrega items desde un selector a un Map
function addFromSelectorToMap(selectedMap, selectorName) {
	const selector = document.getElementById(selectorName);

	if (!selector) return;

	for (const currentOption of selector.selectedOptions) {
		selectedMap.set(currentOption.value, currentOption.text);
	}
}

//Muestra o esconde los filtros
function toggleFilters() {
	const dropdown = document.getElementById("filtersDropdown");
	filtersOpen = !filtersOpen;
	dropdown.style.display = filtersOpen ? "block" : "none";
}

//Cambio seleccionados en selector
function toggleOptionInSelector(selectorName, id, isEnabled) {
	const selector = document.getElementById(selectorName);
	if (selector) {
		const option = selector.querySelector(`option[value="${id}"]`);
		if (option) option.selected = isEnabled;
	}
}

//Vacio mapas de selectores
function cleanMaps() {
	selectedGenresMap.clear();
	selectedPlatformsMap.clear();
}

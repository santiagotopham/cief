//////////////////////////////////////////////////////////////////////////////	CONFIGURACIONES INICIALES	/////////////////////////////////////////////////////////////////////////////
// Key = Id, Value = Name
const selectedGenresMap = new Map();
const selectedPlatformsMap = new Map();

const gameForm = document.getElementById("gameForm");
const genreForm = document.getElementById("genreForm");
const platformForm = document.getElementById("platformForm");

let isInsert = true;

//////////////////////////////////////////////////////////////////////////////	CARGO EVENTOS	/////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
	if (gameForm) {
		gameForm.addEventListener("reset", () => {
			resetForm();
		});

		addEventListener("addGenresBtn", addGenresFromSelect, "click");
		addEventListener("updateAddGenresBtn", addGenresFromSelect, "click");
		addEventListener("addPlatformsBtn", addPlatformsFromSelect, "click");
		addEventListener(
			"updateAddPlatformsBtn",
			addPlatformsFromSelect,
			"click"
		);
		addEventListener("gameForm", handleGameFormSubmit, "submit");
		addEventListener("genreForm", handleGenreFormSubmit, "submit");
		addEventListener("platformForm", handlePlatformFormSubmit, "submit");

		loadGenres();
		loadPlatforms();
	}
});

function addEventListener(elementId, callback, event) {
	const element = document.getElementById(elementId);
	if (element) element.addEventListener(event, callback);
}

//////////////////////////////////////////////////////////////////////////////	GESTIONO FORMULARIOS	/////////////////////////////////////////////////////////////////////////////

//////////////////////  	JUEGOS	   //////////////////////

function loadAndShowGameEditForm(game) {
	isInsert = false;
	resetForm();

	game = JSON.parse(game);

	document.getElementById("gameModalTitle").textContent = "Editar Juego";
	document.getElementById("gameId").value = game.Id;
	document.getElementById("gameTitle").value = game.Title;
	document.getElementById("gameImageUrl").value = game.ImageUrl;
	document.getElementById("gameLaunchDate").value = getCorrectDateFormat(
		game.LaunchDate
	);
	document.getElementById("gameDeveloper").value = game.Developer;
	document.getElementById("gameCategory").value = game.Category;
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

function toggleGameForm() {
	if (gameForm) {
		if (gameForm.style.display == "block") {
			gameForm.style.display = "none";
			sectionUpdate.style.display = "block";
			isInsert = false;
		} else {
			gameForm.style.display = "block";
			sectionUpdate.style.display = "none";
			isInsert = true;
		}
	}
	selectedGenresMap.clear();
	selectedPlatformsMap.clear();
}

function resetForm() {
	selectedGenresMap.clear();
	selectedPlatformsMap.clear();

	for (const currentSelector of document.querySelectorAll(
		"select[multiple]"
	)) {
		for (const currentOption of currentSelector.options) {
			currentOption.selected = false;
		}
	}

	for (const div of document.querySelectorAll(".selected-items")) {
		div.innerHTML = "";
	}

	for (const input of document.querySelectorAll('input[type="hidden"]')) {
		input.value = "";
	}
}

function addGenresFromSelect() {
	let selectorName = "";
	let selectedList = "";

	selectorName = "gameGenres";
	selectedList = "selectedGenresList";

	addFromSelectorToMap(selectedGenresMap, selectorName);

	renderSelectedMap(selectedGenresMap, selectedList, "removeGenre");
}

function removeGenre(id) {
	selectedGenresMap.delete(String(id));
	let selectorName = "gameGenres";
	let selectedList = "selectedGenresList";

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedGenresMap, selectedList, "removeGenre");
}

function addPlatformsFromSelect() {
	let selectorName = "gamePlatforms";
	let selectedList = "selectedPlatformsList";

	addFromSelectorToMap(selectedPlatformsMap, selectorName);
	renderSelectedMap(selectedPlatformsMap, selectedList, "removePlatform");
}

function removePlatform(id) {
	selectedPlatformsMap.delete(String(id));
	let selectorName = "gamePlatforms";
	let selectedList = "selectedPlatformsList";

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedPlatformsMap, selectedList, "removePlatform");
}

//////////////////////  	GENEROS	   //////////////////////

function editGenre(id, name) {
	isInsert = false;
	document.getElementById("genreId").value = id;
	document.getElementById("genreName").value = name;
	document.getElementById("genreModalTitle").textContent = "Editar Género";
	openModal("genreModal");
}

function cancelGenreEdit() {
	document.getElementById("updateGenreForm").reset();
	document.getElementById("updateGenreForm").style.display = "none";
}

//////////////////////  	PLATAFORMAS	   //////////////////////

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

function cancelPlatformEdit() {
	document.getElementById("updatePlatformForm").reset();
	document.getElementById("updatePlatformForm").style.display = "none";
}

//////////////////////////////////////////////////////////////////////////////	MODALES	/////////////////////////////////////////////////////////////////////////////

//////////////////////  	JUEGOS	   //////////////////////
function openGameModal(mode) {
	if (mode === "add") {
		isInsert = true;
		gameForm.reset();
		document.getElementById("gameModalTitle").textContent = "Nuevo Juego";
		resetForm();
	}

	openModal("gameModal");
}

//////////////////////  	GENEROS	   //////////////////////
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
function openModal(modalName) {
	document.getElementById(modalName).classList.add("active");
}

function closeModal(modalName) {
	document.getElementById(modalName).classList.remove("active");
}

// Cerrar modal al clickear afuera
window.onclick = function (event) {
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

async function handleGameFormSubmit(e) {
	e.preventDefault();

	const gameData = {
		id: document.getElementById("gameId").value,
		title: document.getElementById("gameTitle").value.trim(),
		imageUrl: document.getElementById("gameImageUrl").value.trim(),
		launchDate: document.getElementById("gameLaunchDate").value,
		developer: document.getElementById("gameDeveloper").value.trim(),
		category: document.getElementById("gameCategory").value.trim(),
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

function searchGame(event) {
	event.preventDefault();
	const input = document.getElementById("searchInput");
	const name = input.value.trim();
	if (name) {
		globalThis.location.href = `/search/${encodeURIComponent(name)}`;
	}
	return false;
}

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
		} else {
			const data = await res.json();
			if (data.ThumbsUpCounter !== undefined) {
				document.getElementById("thumbsCounter").textContent =
					data.ThumbsUpCounter;
			}

			showToast("Votado");
		}
	} catch (error) {
		showToast("Error al votar");
		console.error(error);
	}
}

//////////////////////  	GENEROS	   //////////////////////

async function loadGenres() {
	const res = await fetch("/genre/all");
	const data = await res.json();

	const tbody = document.getElementById("genresTableBody");
	tbody.innerHTML = "";

	for (const genre of data) {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${genre.Id}</td>
			<td>${genre.Name}</td>
			<td>
				<button onclick="editGenre(${genre.Id}, '${genre.Name}')">Editar</button>
				<button onclick="deleteGenre(${genre.Id})">Eliminar</button>
			</td>`;
		tbody.appendChild(tr);
	}
}

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

async function loadPlatforms() {
	try {
		const response = await fetch("/platform/all");
		if (!response.ok) throw new Error("Error al cargar plataformas");

		const data = await response.json();

		const tbody = document.getElementById("platformsTableBody");
		if (!tbody) return;

		tbody.innerHTML = "";

		for (const platform of data) {
			const tr = document.createElement("tr");
			tr.innerHTML = `
				<td>${platform.Id}</td>
				<td>${platform.Name}</td>
				<td>${platform.MainPlatformName || "N/A"}</td>
				<td>
					<button onclick="editPlatform(${platform.Id}, '${platform.Name}', ${
				platform.MainPlatformId
			})">Editar</button>
					<button onclick="deletePlatform(${platform.Id})">Eliminar</button>
				</td>`;
			tbody.appendChild(tr);
		}
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al cargar las plataformas", true);
	}
}

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

//////////////////////////////////////////////////////////////////////////////	METODOS AUXILIARES	/////////////////////////////////////////////////////////////////////////////

function getCorrectDateFormat(unformattedDate) {
	if (!unformattedDate) return "";

	// Si ya viene en formato YYYY-MM-DD, devolverlo directamente
	if (/^\d{4}-\d{2}-\d{2}$/.test(unformattedDate)) {
		return unformattedDate;
	}

	// Crear fecha sin conversión de zona horaria
	const date = new Date(unformattedDate);

	// Verificar si la fecha es válida
	if (isNaN(date.getTime())) {
		console.error("Fecha inválida:", unformattedDate);
		return "";
	}

	// Obtener componentes de fecha en zona horaria local
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function loadEditChipItems(itemsArray, selectedMap, selectorName, callback) {
	if (itemsArray && Array.isArray(itemsArray)) {
		selectedMap.clear();

		for (const currentItem of itemsArray) {
			toggleOptionInSelector(selectorName, currentItem.Id, true);
		}

		callback();
	}
}

function addFromSelectorToMap(selectedMap, selectorName) {
	const selector = document.getElementById(selectorName);

	if (!selector) return;

	for (const currentOption of selector.selectedOptions) {
		selectedMap.set(currentOption.value, currentOption.text);
	}
}

//Cambio seleccionados en selector
function toggleOptionInSelector(selectorName, id, isEnabled) {
	const selector = document.getElementById(selectorName);
	if (selector) {
		const option = selector.querySelector(`option[value="${id}"]`);
		if (option) option.selected = isEnabled;
	}
}

//////////////////////////////////////////////////////////////////////////////	CONSTRUCCION DE CONTENIDO	/////////////////////////////////////////////////////////////////////////////

function renderSelectedMap(selectedMap, renderDivId, removeFnName) {
	const containerDiv = document.getElementById(renderDivId);

	if (!containerDiv) return;

	containerDiv.innerHTML = "";

	for (const currentItem of selectedMap) {
		const chip = document.createElement("span");
		chip.className = "item-chip";
		chip.innerHTML = `${currentItem[1]} <button type="button" class="remove-chip" onclick="${removeFnName}('${currentItem[0]}')">×</button>`;
		containerDiv.appendChild(chip);
	}
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

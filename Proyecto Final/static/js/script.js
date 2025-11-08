// key = id, value = nombre
const selectedGenres = new Map();
const selectedPlatforms = new Map();

const sectionInsert = document.querySelector(".insert");
const sectionUpdate = document.querySelector(".update");
let isInsert = true;
toggleGameForm();

//Gestiono formularios
function toggleGameForm() {
	if (sectionInsert) {
		if (sectionInsert.style.display == "block") {
			sectionInsert.style.display = "none";
			sectionUpdate.style.display = "block";
			isInsert = false;
		} else {
			sectionInsert.style.display = "block";
			sectionUpdate.style.display = "none";
			isInsert = true;
		}
	}
	selectedGenres.clear();
	selectedPlatforms.clear();
}

function loadAndShowEditForm(game) {
	if (isInsert) toggleGameForm();
	resetForm();
	game = JSON.parse(game);

	document.getElementById("id").value = game.Id;
	document.getElementById("updateTitle").value = game.Title;
	document.getElementById("updateImageUrl").value = game.ImageUrl;
	document.getElementById("updateLaunchDate").value = getCorrectDateFormat(
		game.LaunchDate
	);
	document.getElementById("updateDeveloper").value = game.Developer;
	document.getElementById("updateCategory").value = game.Category;
	document.getElementById("updateSynopsis").value = game.Synopsis;

	loadEditChipItems(
		game.Genres,
		selectedGenres,
		"updateGenres",
		addGenresFromSelect
	);

	loadEditChipItems(
		game.Platforms,
		selectedPlatforms,
		"updatePlatforms",
		addPlatformsFromSelect
	);
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

//Seteo eventos al inicio
document.addEventListener("DOMContentLoaded", () => {
	addClickFunction("addGenresBtn", addGenresFromSelect);
	addClickFunction("updateAddGenresBtn", addGenresFromSelect);
	addClickFunction("addPlatformsBtn", addPlatformsFromSelect);
	addClickFunction("updateAddPlatformsBtn", addPlatformsFromSelect);

	const createForm = document.querySelector(".insert form");
	if (createForm) {
		createForm.addEventListener("reset", () => {
			resetForm();
		});
	}
});

function addClickFunction(elementId, callback) {
	const element = document.getElementById(elementId);
	if (element) element.addEventListener("click", callback);
}

function resetForm() {
	selectedGenres.clear();
	selectedPlatforms.clear();

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

//Interaccion con backend
function deleteGame(id) {
	fetch(`/game/delete/${id}`, {
		method: "DELETE",
	})
		.then((response) => response.json())
		.then(setTimeout(() => location.reload(), 300))
		.catch((error) => console.error("Error:", error));
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

//Metodos auxiliares
function getCorrectDateFormat(unformattedDate) {
	const date = new Date(unformattedDate);
	return date.toISOString().split("T")[0];
}

function addGenresFromSelect() {
	let selectorName = "";
	let selectedList = "";

	if (isInsert) {
		selectorName = "genres";
		selectedList = "selectedGenresList";
	} else {
		selectorName = "updateGenres";
		selectedList = "updateSelectedGenresList";
	}

	addFromSelectorToMap(selectedGenres, selectorName);

	renderSelectedMap(selectedGenres, selectedList, "removeGenre");
}

function addPlatformsFromSelect() {
	let selectorName = "";
	let selectedList = "";

	if (isInsert) {
		selectorName = "platforms";
		selectedList = "selectedPlatformsList";
	} else {
		selectorName = "updatePlatforms";
		selectedList = "updateSelectedPlatformsList";
	}

	addFromSelectorToMap(selectedPlatforms, selectorName);

	renderSelectedMap(selectedPlatforms, selectedList, "removePlatform");
}

function addFromSelectorToMap(selectedMap, selectorName) {
	const selector = document.getElementById(selectorName);

	if (!selector) return;

	for (const currentOption of selector.selectedOptions) {
		selectedMap.set(currentOption.value, currentOption.text);
	}
}

function renderSelectedMap(selectedMap, renderDivId, removeFnName) {
	const containerDiv = document.getElementById(renderDivId);

	if (!containerDiv) return;

	// Limpiar contenedor
	containerDiv.innerHTML = "";

	// Renderizar chips
	for (const currentItem of selectedMap) {
		const chip = document.createElement("span");
		chip.className = "item-chip";
		chip.innerHTML = `${currentItem[1]} <button type="button" class="remove-chip" onclick="${removeFnName}('${currentItem[0]}')">×</button>`;
		containerDiv.appendChild(chip);
	}
}

function removeGenre(id) {
	selectedGenres.delete(String(id));
	let selectorName = "";
	let selectedList = "";

	if (isInsert) {
		selectorName = "genres";
		selectedList = "selectedGenresList";
	} else {
		selectorName = "updateGenres";
		selectedList = "updateSelectedGenresList";
	}

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedGenres, selectedList, "removeGenre");
}

function removePlatform(id) {
	selectedPlatforms.delete(String(id));
	let selectorName = "";
	let selectedList = "";

	if (isInsert) {
		selectorName = "platforms";
		selectedList = "selectedPlatformsList";
	} else {
		selectorName = "updatePlatforms";
		selectedList = "updateSelectedPlatformsList";
	}

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedPlatforms, selectedList, "removePlatform");
}

//Cambio seleccionados en selector
function toggleOptionInSelector(selectorName, id, isEnabled) {
	const selector = document.getElementById(selectorName);
	if (selector) {
		const option = selector.querySelector(`option[value="${id}"]`);
		if (option) option.selected = isEnabled;
	}
}

// async function voteGame(gameId, direction) {
// 	try {
// 		// Realiza un PUT al endpoint de edición
// 		const res = await fetch(`/game/vote/${gameId}`, {
// 			method: "PUT",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({
// 				likesCount: direction, // 'up' o 'down'
// 			}),
// 		});

// 		if (!res.ok) {
// 			console.error("Error al actualizar el voto");
// 			return;
// 		}

// 		// Asumimos que el backend devuelve el nuevo contador
// 		const data = await res.json();
// 		if (data.ThumbsUpCounter !== undefined) {
// 			document.getElementById("thumbsCounter").textContent =
// 				data.ThumbsUpCounter;
// 		}
// 	} catch (err) {
// 		console.error("Error en la votación:", err);
// 	}
// }

document.addEventListener("DOMContentLoaded", () => {
	loadGenres();
	loadPlatforms();

	document
		.getElementById("createGenreForm")
		.addEventListener("submit", createGenre);
	document
		.getElementById("updateGenreForm")
		.addEventListener("submit", updateGenre);

	document
		.getElementById("createPlatformForm")
		.addEventListener("submit", createPlatform);
	document
		.getElementById("updatePlatformForm")
		.addEventListener("submit", updatePlatform);
});

/* ======== GÉNEROS ======== */

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

async function createGenre(e) {
	e.preventDefault();
	const name = document.getElementById("genreName").value.trim();
	if (!name) return;

	await fetch("/genre/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ Name: name }),
	});

	document.getElementById("createGenreForm").reset();
	loadGenres();
}

function editGenre(id, name) {
	document.getElementById("updateGenreId").value = id;
	document.getElementById("updateGenreName").value = name;
	document.getElementById("updateGenreForm").style.display = "grid";
}

async function updateGenre(e) {
	e.preventDefault();

	const id = document.getElementById("updateGenreId").value;
	const name = document.getElementById("updateGenreName").value.trim();

	await fetch("/genre/edit", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ Id: id, Name: name }),
	});

	cancelGenreEdit();
	loadGenres();
}

async function deleteGenre(id) {
	if (!confirm("¿Eliminar este género?")) return;
	await fetch(`/genre/delete/${id}`, { method: "DELETE" });
	loadGenres();
}

function cancelGenreEdit() {
	document.getElementById("updateGenreForm").reset();
	document.getElementById("updateGenreForm").style.display = "none";
}

/* ======== PLATAFORMAS ======== */

async function loadPlatforms() {
	const res = await fetch("/platform/all");
	const data = await res.json();

	const tbody = document.getElementById("platformsTableBody");
	tbody.innerHTML = "";

	for (const platform of data) {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${platform.Id}</td>
			<td>${platform.Name}</td>
			<td>
				<button onclick="editPlatform(${platform.Id}, '${platform.Name}')">Editar</button>
				<button onclick="deletePlatform(${platform.Id})">Eliminar</button>
			</td>`;
		tbody.appendChild(tr);
	}
}

async function createPlatform(e) {
	e.preventDefault();
	const name = document.getElementById("platformName").value.trim();
	if (!name) return;

	await fetch("/platform/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ Name: name }),
	});

	document.getElementById("createPlatformForm").reset();
	loadPlatforms();
}

function editPlatform(id, name) {
	document.getElementById("updatePlatformId").value = id;
	document.getElementById("updatePlatformName").value = name;
	document.getElementById("updatePlatformForm").style.display = "grid";
}

async function updatePlatform(e) {
	e.preventDefault();

	const id = document.getElementById("updatePlatformId").value;
	const name = document.getElementById("updatePlatformName").value.trim();

	await fetch("/platform/edit", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ Id: id, Name: name }),
	});

	cancelPlatformEdit();
	loadPlatforms();
}

async function deletePlatform(id) {
	if (!confirm("¿Eliminar esta plataforma?")) return;
	await fetch(`/platform/delete/${id}`, { method: "DELETE" });
	loadPlatforms();
}

function cancelPlatformEdit() {
	document.getElementById("updatePlatformForm").reset();
	document.getElementById("updatePlatformForm").style.display = "none";
}

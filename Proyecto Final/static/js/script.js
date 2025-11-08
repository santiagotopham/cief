// key = id, value = nombre
const selectedGenres = new Map();
const selectedPlatforms = new Map();

const sectionInsert = document.querySelector(".insert");
const sectionUpdate = document.querySelector(".update");
let isInsert = true;
toggleForm();

//Gestiono formularios
function toggleForm() {
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
	if (isInsert) toggleForm();
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

	if (game.Genres && Array.isArray(game.Genres)) {
		selectedGenres.clear();

		console.log(game.Genres);

		for (const currentGenre of game.Genres) {
			toggleOptionInSelector("updateGenres", currentGenre.Id, true);
		}

		addGenresFromSelect();
	}

	if (game.Platforms && Array.isArray(game.Platforms)) {
		selectedPlatforms.clear();

		for (const currentPlatform of game.Platforms) {
			toggleOptionInSelector("updatePlatforms", currentPlatform.Id, true);
		}

		addPlatformsFromSelect();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const addGenreBtn = document.getElementById("addGenresBtn");
	if (addGenreBtn) addGenreBtn.addEventListener("click", addGenresFromSelect);

	const updateGenreBtn = document.getElementById("updateAddGenresBtn");
	if (updateGenreBtn)
		updateGenreBtn.addEventListener("click", addGenresFromSelect);

	const addPlatformBtn = document.getElementById("addPlatformsBtn");
	if (addPlatformBtn)
		addPlatformBtn.addEventListener("click", addPlatformsFromSelect);

	const updatePlatformBtn = document.getElementById("updateAddPlatformsBtn");
	if (updatePlatformBtn)
		updatePlatformBtn.addEventListener("click", addPlatformsFromSelect);

	const createForm = document.querySelector(".insert form");
	if (createForm) {
		createForm.addEventListener("reset", () => {
			resetForm();
		});
	}
});

function resetForm() {
	selectedGenres.clear();
	selectedPlatforms.clear();

	document.querySelectorAll("select[multiple]").forEach((sel) => {
		Array.from(sel.options).forEach((opt) => (opt.selected = false));
	});

	document
		.querySelectorAll(".selected-items")
		.forEach((div) => (div.innerHTML = ""));
	document
		.querySelectorAll('input[type="hidden"]')
		.forEach((inp) => (inp.value = ""));
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

function renderSelectedMap(
	selectedMap,
	renderDivId,
	hiddenInputId,
	removeFnName
) {
	const containerDiv = document.getElementById(renderDivId);
	const hiddenInput = document.getElementById(hiddenInputId);

	if (!containerDiv || !hiddenInput) return;

	// Limpiar contenedor
	containerDiv.innerHTML = "";

	// Renderizar chips
	selectedMap.forEach((name, id) => {
		const chip = document.createElement("span");
		chip.className = "item-chip";
		chip.innerHTML = `${name} <button type="button" class="remove-chip" onclick="${removeFnName}('${id}')">×</button>`;
		containerDiv.appendChild(chip);
	});

	// Actualizar campo oculto con IDs
	hiddenInput.value = Array.from(selectedMap.keys()).join(",");
}

function addGenresFromSelect() {
	let selectorName = "";
	let selectedList = "";
	let selectedIds = "";

	if (isInsert) {
		selectorName = "genres";
		selectedList = "selectedGenresList";
		selectedIds = "selectedGenresIds";
	} else {
		console.log("entro");
		selectorName = "updateGenres";
		selectedList = "updateSelectedGenresList";
		selectedIds = "updateSelectedGenresIds";
	}

	addFromSelectorToMap(selectedGenres, selectorName);

	renderSelectedMap(selectedGenres, selectedList, selectedIds, "removeGenre");
}

function addPlatformsFromSelect() {
	let selectorName = "";
	let selectedList = "";
	let selectedIds = "";

	if (isInsert) {
		selectorName = "platforms";
		selectedList = "selectedPlatformsList";
		selectedIds = "selectedPlatformsIds";
	} else {
		selectorName = "updatePlatforms";
		selectedList = "updateSelectedPlatformsList";
		selectedIds = "updateSelectedPlatformsIds";
	}

	addFromSelectorToMap(selectedPlatforms, selectorName);

	renderSelectedMap(
		selectedPlatforms,
		selectedList,
		selectedIds,
		"removePlatform"
	);
}

function addFromSelectorToMap(selectedMap, selectorName) {
	const selector = document.getElementById(selectorName);

	if (!selector) return;

	Array.from(selector.selectedOptions).forEach((opt) => {
		selectedMap.set(opt.value, opt.text);
	});
}

// --- Remove para create ---
function removeGenre(id) {
	selectedGenres.delete(String(id));
	let selectorName = "";
	let selectedList = "";
	let selectedIds = "";

	if (isInsert) {
		selectorName = "genres";
		selectedList = "selectedGenresList";
		selectedIds = "selectedGenresIds";
	} else {
		selectorName = "updateGenres";
		selectedList = "updateSelectedGenresList";
		selectedIds = "updateSelectedGenresIds";
	}

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(selectedGenres, selectedList, selectedIds, "removeGenre");
}

// --- Remove para create ---
function removePlatform(id) {
	selectedPlatforms.delete(String(id));
	let selectorName = "";
	let selectedList = "";
	let selectedIds = "";

	if (isInsert) {
		selectorName = "platforms";
		selectedList = "selectedPlatformsList";
		selectedIds = "selectedPlatformsIds";
	} else {
		selectorName = "updatePlatforms";
		selectedList = "updateSelectedPlatformsList";
		selectedIds = "updateSelectedPlatformsIds";
	}

	toggleOptionInSelector(selectorName, id, false);
	renderSelectedMap(
		selectedPlatforms,
		selectedList,
		selectedIds,
		"removePlatform"
	);
}

//Cambio seleccionados en selector
function toggleOptionInSelector(selectorName, id, isEnabled) {
	const selector = document.getElementById(selectorName);
	if (selector) {
		const option = selector.querySelector(`option[value="${id}"]`);
		if (option) option.selected = isEnabled;
	}

	console.log(selector.selectedOptions);
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

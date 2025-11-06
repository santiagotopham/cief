// key = id, value = nombre
const selectedCreateGenres = new Map();
const selectedEditGenres = new Map();
const selectedCreatePlatforms = new Map();
const selectedEditPlatforms = new Map();

const sectionInsert = document.querySelector(".insert");
const sectionUpdate = document.querySelector(".update");
let isInsert = true;
toggleForm();

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
}

function loadAndShowEditForm(game) {
	if (isInsert) toggleForm();
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
		selectedEditGenres.clear();
		game.Genres.forEach((g) => selectedEditGenres.set(g.Id, g.Name));
		renderEditGenres();
	}

	if (game.Platforms && Array.isArray(game.Platforms)) {
		selectedEditPlatforms.clear();
		game.Platforms.forEach((g) => selectedEditPlatforms.set(g.Id, g.Name));
		renderEditPlatforms();
	}
}

function getCorrectDateFormat(unformattedDate) {
	const date = new Date(unformattedDate);
	return date.toISOString().split("T")[0];
}

function deleteGame(id) {
	fetch(`/game/delete/${id}`, {
		method: "DELETE",
	})
		.then((response) => response.json())
		.then(setTimeout(() => location.reload(), 300))
		.catch((error) => console.error("Error:", error));
}

function selectGenres() {
	const select = document.getElementById("genres");
	const selectedList = document.getElementById("selectedGenresList");
	const hiddenInput = document.getElementById("selectedGenresIds");

	//Store selected genres in global map
	Array.from(select.selectedOptions).forEach((opt) => {
		if (!selectedCreateGenres.has(opt.value)) {
			selectedCreateGenres.set(opt.value, opt.text);
		}
	});

	//Build render for list of selected genres
	selectedList.innerHTML = "";
	selectedCreateGenres.forEach((name, id) => {
		const chip = document.createElement("span");
		chip.className = "genre-chip";
		chip.innerHTML = `${name} <button type="button" class="remove-chip" onclick="removeGenre('${id}')">×</button>`;
		selectedList.appendChild(chip);
	});

	//Store selected ids for easier form handling
	hiddenInput.value = Array.from(selectedCreateGenres.keys()).join(",");
}

function removeGenre(id) {
	selectedCreateGenres.delete(id);
	selectGenres();
}

function renderEditGenres() {
	const selectedList = document.getElementById("updateSelectedGenresList");
	const hiddenInput = document.getElementById("updateSelectedGenresIds");

	selectedList.innerHTML = "";
	selectedEditGenres.forEach((name, id) => {
		const chip = document.createElement("span");
		chip.className = "genre-chip";
		chip.innerHTML = `${name} <button type="button" class="remove-chip" onclick="removeEditGenre('${id}')">×</button>`;
		selectedList.appendChild(chip);
	});

	hiddenInput.value = Array.from(selectedEditGenres.keys()).join(",");
}

function removeEditGenre(id) {
	selectedEditGenres.delete(id);
	renderEditGenres();
}

function selectPlatforms() {
	const select = document.getElementById("platforms");
	const selectedList = document.getElementById("selectedPlatformsList");
	const hiddenInput = document.getElementById("selectedPlatformsIds");

	//Store selected platfroms in global map
	Array.from(select.selectedOptions).forEach((opt) => {
		if (!selectedCreatePlatforms.has(opt.value)) {
			selectedCreatePlatforms.set(opt.value, opt.text);
		}
	});

	//Build render for list of selected platforms
	selectedList.innerHTML = "";
	selectedCreatePlatforms.forEach((name, id) => {
		const chip = document.createElement("span");
		chip.className = "genre-chip";
		chip.innerHTML = `${name} <button type="button" class="remove-chip" onclick="removePlatform('${id}')">×</button>`;
		selectedList.appendChild(chip);
	});

	//Store selected ids for easier form handling
	hiddenInput.value = Array.from(selectedCreatePlatforms.keys()).join(",");
}

function removePlatform(id) {
	selectedCreatePlatforms.delete(id);
	selectPlatforms();
}

function renderEditPlatforms() {
	const selectedList = document.getElementById("updateSelectedPlatformsList");
	const hiddenInput = document.getElementById("updateSelectedPlatformsIds");

	selectedList.innerHTML = "";
	selectedEditPlatforms.forEach((name, id) => {
		const chip = document.createElement("span");
		chip.className = "genre-chip";
		chip.innerHTML = `${name} <button type="button" class="remove-chip" onclick="removeEditPlatform('${id}')">×</button>`;
		selectedList.appendChild(chip);
	});

	hiddenInput.value = Array.from(selectedEditPlatforms.keys()).join(",");
}

function removeEditPlatform(id) {
	selectedEditPlatforms.delete(id);
	renderEditPlatforms();
}

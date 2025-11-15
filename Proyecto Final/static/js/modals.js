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

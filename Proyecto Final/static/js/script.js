//////////////////////////////////////////////////////////////////////////////	CARGO EVENTOS	/////////////////////////////////////////////////////////////////////////////

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

	const loginForm = document.getElementById("loginForm");
	if (loginForm) {
		loginForm.addEventListener("submit", handleLoginSubmit);
	}

	checkAdminAccess();

	await loadFilters();
});

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

//////////////////////  	LOGIN	   //////////////////////

//Iniciar sesion
async function handleLoginSubmit(e) {
	e.preventDefault();

	const username = document.getElementById("username").value.trim();
	const password = document.getElementById("password").value;

	if (!username || !password) {
		showToast("Complete todos los campos", true);
		return;
	}

	try {
		const hashedPassword = await hashPassword(password);

		const response = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password: hashedPassword }),
		});

		if (!response.ok) {
			throw new Error("Credenciales inválidas");
		}

		const data = await response.json();

		if (data.success) {
			sessionStorage.setItem("adminLoggedIn", "true");
			isLoggedIn = true;

			showToast("Login exitoso");
			setTimeout(() => {
				globalThis.location.href = "/admin";
			}, 1000);
		} else {
			throw new Error("Credenciales inválidas");
		}
	} catch (error) {
		console.error("Error:", error);
		showToast("Usuario o contraseña incorrectos", true);
		sessionStorage.removeItem("adminLoggedIn");
		isLoggedIn = false;
	}
}

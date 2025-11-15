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

	chip.innerHTML = `${escapeHtml(text)} `;

	if (id && removeFnName) {
		// Validar que removeFnName es seguro (solo letras y números)
		const safeFnName = /^[a-zA-Z0-9_]+$/.test(removeFnName)
			? removeFnName
			: "";
		if (safeFnName) {
			chip.innerHTML += `<button type="button" class="remove_chip" onclick="${safeFnName}(${parseInt(
				id
			)})">×</button>`;
		}
	}

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
				<span class="comment_author">${escapeHtml(comment.UserName)}</span>
				<span class="comment_date">${escapeHtml(comment.PublishedDate)}</span>
			</div>
			<p class="comment_text">${escapeHtml(comment.Text)}</p>
		`;

		if (isLoggedIn) {
			commentDiv.innerHTML += `
			<button class="comment_delete_btn" onclick="deleteComment(${parseInt(comment.Id)}, ${parseInt(comment.GameId)})" title="Eliminar comentario">
				×
			</button>`;
		}

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
		// Escapar el nombre para prevenir XSS en el atributo onclick
		const safeName = escapeHtml(currentGenre.Name).replace(/'/g, "\\'");
		tr.innerHTML = `
			<td>${escapeHtml(currentGenre.Id)}</td>
			<td>${escapeHtml(currentGenre.Name)}</td>
			<td>
				<button onclick="editGenre(${parseInt(
					currentGenre.Id
				)}, '${safeName}')">Editar</button>
				<button onclick="deleteGenre(${parseInt(
					currentGenre.Id
				)})">Eliminar</button>
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
		// Escapar el nombre para prevenir XSS en el atributo onclick
		const safeName = escapeHtml(currentPlatform.Name).replace(/'/g, "\\'");
		tr.innerHTML = `
			<td>${escapeHtml(currentPlatform.Id)}</td>
			<td>${escapeHtml(currentPlatform.Name)}</td>
			<td>${escapeHtml(currentPlatform.MainPlatformName || "N/A")}</td>
			<td>
				<button onclick="editPlatform(${parseInt(
					currentPlatform.Id
				)}, '${safeName}', ${parseInt(
			currentPlatform.MainPlatformId
		)})">Editar</button>
				<button onclick="deletePlatform(${parseInt(
					currentPlatform.Id
				)})">Eliminar</button>
			</td>`;
		table.appendChild(tr);
	}
}

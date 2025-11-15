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

//Verificar login
function checkAdminAccess() {
	const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";

	if (!isLoggedIn && globalThis.location.pathname === "/admin") {
		globalThis.location.href = "/login";
	}
}

//Cerrar sesion
function logout() {
	sessionStorage.removeItem("adminLoggedIn");
	isLoggedIn = false;
	globalThis.location.href = "/";
}

// Función para hashear la contraseña con MD5 simple
async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

//Agrega evento a item de html
function addListenerById(elementId, callback, event) {
	const element = document.getElementById(elementId);
	if (element) element.addEventListener(event, callback);
	return element;
}

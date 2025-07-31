// MINI BIBLIOTECA

const biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [
	{
		titulo: "Guerra y Paz",
		autor: "Lev Tolstoi",
		categoria: "drama",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "Anna Karenina",
		autor: "Lev Tolstoi",
		categoria: "drama",
		idioma: "català",
		epoca: "s.XIX",
	},
	{
		titulo: "L'Odisea",
		autor: "Homero",
		categoria: "drama",
		idioma: "català",
		epoca: "clásica",
	},
	{
		titulo: "Antologia de la poesia medieval catalana",
		autor: "Diversos",
		categoria: "poesia",
		idioma: "català",
		epoca: "clásica",
	},
	{
		titulo: "La Ilíada",
		autor: "Homero",
		categoria: "drama",
		idioma: "español",
		epoca: "clásica",
	},
	{
		titulo: "Poema del Mio Cid",
		autor: "Anónimo",
		categoria: "poesia",
		idioma: "español",
		epoca: "clásica",
	},
	{
		titulo: "Veinte mil leguas de viaje submarino",
		autor: "Jules Verne",
		categoria: "aventuras",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "De la Terra a la Lluna",
		autor: "Jules Verne",
		categoria: "aventuras",
		idioma: "català",
		epoca: "s.XIX",
	},
	{
		titulo: "Cinco semanas en globo",
		autor: "Jules Verne",
		categoria: "aventuras",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "Robinson Crusoe",
		autor: "Daniel Defoe",
		categoria: "aventuras",
		idioma: "català",
		epoca: "clásica",
	},
	{
		titulo: "Germinal",
		autor: "Émile Zola",
		categoria: "drama",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "Notre Dame de Paris",
		autor: "Victor Hugo",
		categoria: "drama",
		idioma: "català",
		epoca: "s.XIX",
	},
	{
		titulo: "Los Miserables",
		autor: "Victor Hugo",
		categoria: "drama",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "Yo, robot",
		autor: "Isaac Asimov",
		categoria: "ciencia-ficción",
		idioma: "español",
		epoca: "s.XX",
	},
	{
		titulo: "Fundació",
		autor: "Isaac Asimov",
		categoria: "ciencia-ficción",
		idioma: "català",
		epoca: "s.XX",
	},
	{
		titulo: "Ciberiada",
		autor: "Stanislaw Lem",
		categoria: "ciencia-ficción",
		idioma: "español",
		epoca: "s.XX",
	},
	{
		titulo: "Solaris",
		autor: "Stanislaw Lem",
		categoria: "ciencia-ficción",
		idioma: "català",
		epoca: "s.XX",
	},
	{
		titulo: "El hombre bicentenario",
		autor: "Isaac Asimov",
		categoria: "ciencia-ficción",
		idioma: "español",
		epoca: "s.XX",
	},
	{
		titulo: "Tokio Blues",
		autor: "Haruki Murakami",
		categoria: "drama",
		idioma: "español",
		epoca: "s.XX",
	},
	{
		titulo: "Romancero Gitano",
		autor: "Federico García Lorca",
		categoria: "poesia",
		idioma: "español",
		epoca: "s.XX",
	},
	{
		titulo: "Los aventuras de Sherlock Holmes",
		autor: "Arthur Conan Doyle",
		categoria: "misterio",
		idioma: "español",
		epoca: "s.XIX",
	},
	{
		titulo: "Rebelió a la granja",
		autor: "George Orwell",
		categoria: "drama",
		idioma: "català",
		epoca: "s.XX",
	},
	{
		titulo: "La Divina Comedia",
		autor: "Dante Alighieri",
		categoria: "drama",
		idioma: "español",
		epoca: "clásica",
	},
	{
		titulo: "Fahrenheit 451",
		autor: "Ray Bradbury",
		categoria: "ciencia-ficción",
		idioma: "català",
		epoca: "s.XX",
	},
	{
		titulo: "Cròniques Marcianes",
		autor: "Ray Bradbury",
		categoria: "ciencia-ficción",
		idioma: "català",
		epoca: "s.XX",
	},
];

function UpdateLocalStorage() {
	localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
}

UpdateLocalStorage();

// ==========================================================================================================
// EJERCICIO 1
// Libros disponibleS
// Mostrar la lista de obras alfabéticamente según el título, en forma de lista ordenada

let orderedBookList = GetBooks();

function LoadEjer1(list) {
	RenderHtml("ejer1", BuildHtmlList(list, BuildBooksList));
}

LoadEjer1(orderedBookList);

function GetBooks() {
	return biblioteca.toSorted((a, b) => a.titulo.localeCompare(b.titulo));
}

function RenderHtml(id, htmlToRender) {
	let htmlTag = document.getElementById(id);
	htmlTag.innerHTML = htmlToRender;
}

function BuildHtmlList(list, buildListMethod) {
	let htmlToRender = "<ol>";

	list.forEach((x) => {
		htmlToRender += buildListMethod(x);
	});

	htmlToRender += "</ol>";

	return htmlToRender;
}

function BuildBooksList(book) {
	return `<li><span class="autor">${book.autor}</span> : ${book.titulo} (${book.categoria}), ${book.idioma}</li>`;
}

function BuildSearchBooksList(book) {
	return `<li><span class="autor">${book.autor}</span> : ${book.titulo} (${book.categoria}), idioma : ${book.idioma}, época : ${book.epoca}</li>`;
}

// Llista del llibres
// const listaLibros = document.getElementById("listaLibros");

// ==========================================================================================================
// EJERCICIO 2
// Filtrar las obras según los criterios indicados en el formulario.
// Las obras que cumplan las condiciones se mostrarán dentro del div con id salidaFiltrada
// Las obras se mostrarán según aparece en la imagen modelo1.png
// Hay que aplicar algunos estilos que ya están definidos en el css

RenderHtml("ejer2", BuildHtmlList(orderedBookList, BuildBooksList));
const formEj2 = document.forms["form-filtrado"];

const defaultValue = "todo";
let selectedCategory = defaultValue;
let selectedLanguage = defaultValue;
let selectedEra = defaultValue;

formEj2.addEventListener("change", (e) => {
	switch (e.target.name) {
		case "categoria":
			selectedCategory = e.target.value;
			break;
		case "idioma":
			selectedLanguage = e.target.value;
			break;
		case "epoca":
			selectedEra = e.target.value;
			break;
	}

	let filteredList = [];
	orderedBookList.forEach((x) => {
		if (
			(x.categoria == selectedCategory ||
				selectedCategory == defaultValue) &&
			(x.idioma == selectedLanguage ||
				selectedLanguage == defaultValue) &&
			(x.epoca == selectedEra || selectedEra == defaultValue)
		) {
			filteredList.push(x);
		}
	});

	RenderHtml("ejer2", BuildHtmlList(filteredList, BuildBooksList));
});

// ==========================================================================================================
// EJERCICIO 3
// Filtrar por autor
// Selección de obras según el nombre o parte del nombre de un autor.
// Al hacer clic sobre el botón buscar se mostrarán las obras cuyos autores cumplen los requisitos.
// La salida por pantalla será en este formato:
// Isaac Asimov : Yo, robot (ciencia-ficción, idioma : español, época : s.XX)

const ejer3 = document.getElementById("ejer3");
const formEj3 = document.forms["form-autor"];

formEj3.addEventListener("submit", (e) => {
	e.preventDefault();

	let autorName = document.getElementById("autor").value.toLocaleLowerCase();

	let filteredList = GetBooks();

	filteredList = filteredList.filter((x) =>
		x.autor.toLocaleLowerCase().includes(autorName)
	);

	let htmlToRender = "";

	if (filteredList.length > 0) {
		htmlToRender = BuildHtmlList(filteredList, BuildSearchBooksList);
	} else {
		htmlToRender = `<span>No se encontraron obras de <span class="autor">${autorName}</span></span>`;
	}

	RenderHtml("ejer3", htmlToRender);
});

// ==========================================================================================================
// EJERCICIO 4
// Añadir obra a la biblioteca
// A partir del formulario, añadir obras a la biblioteca
// Conseguir permanencia con LocalStorage
// Actualizar automáticamente el listado de obras del ejercicio 1

const formEj4 = document.forms["incluirObra"];

formEj4.addEventListener("submit", (e) => {
	e.preventDefault();

	let newBook = {
		titulo: document.getElementById("incluir-titulo").value,
		autor: document.getElementById("incluir-autor").value,
		categoria: document.getElementById("incluir-categoria").value,
		idioma: document.getElementById("incluir-idioma").value,
		epoca: document.getElementById("incluir-epoca").value,
	};

	let duplicatedBook = biblioteca.find(
		(x) => x.titulo == newBook.titulo && x.autor == newBook.autor
	);

	if (duplicatedBook != null) {
		alert("duplicado");
	} else {
		biblioteca.push(newBook);

		RefreshLibrary();
		formEj4.reset();
	}
});

function RefreshLibrary() {
	UpdateLocalStorage();
	orderedBookList = GetBooks();
	LoadEjer1(orderedBookList);
}

// ==========================================================================================================
// EJERCICIO 5
// Quitar obras de la biblioteca. Crea en un formulario una etiqueta select con las obras de la biblioteca.
// Al seleccionar una obra y enviar el formulario, se eliminará la obra de la biblioteca.
// Actualizar automáticamente el listado de obras del ejercicio 1
// Actualizar el LocalStorage

const formEj5 = document.forms["deleteForm"];
RefreshRemovalOptions();

formEj5.addEventListener("submit", (e) => {
	e.preventDefault();

	let bookToDelete = document.getElementById("booksToRemove").value;
	const indexToDelete = biblioteca.findIndex((x) => x.titulo == bookToDelete);

	if (indexToDelete > -1) {
		biblioteca.splice(indexToDelete, 1);
		RefreshLibrary();
		RefreshRemovalOptions();
	}
});

function RefreshRemovalOptions() {
	const selectForRemoval = document.getElementById("booksToRemove");
	selectForRemoval.innerHTML = BuildRemovalOptions();
}

function BuildRemovalOptions() {
	let optionsToRemove = "";
	orderedBookList.forEach((x) => {
		optionsToRemove += `<option value="${x.titulo}">${x.titulo}</option>`;
	});
	return optionsToRemove;
}

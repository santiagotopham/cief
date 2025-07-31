let flowers = [
	{
		Name: "cerezo",
		Color: "rosa",
		Season: "primavera",
		HasStock: true,
	},
	{
		Name: "clavel",
		Color: "blanco",
		Season: "verano",
		HasStock: false,
	},
	{
		Name: "crisantemo",
		Color: "blanco",
		Season: "otoño",
		HasStock: false,
	},
	{
		Name: "jazmin",
		Color: "blanco",
		Season: "verano",
		HasStock: true,
	},
	{
		Name: "rosa",
		Color: "rojo",
		Season: "primavera",
		HasStock: true,
	},
	{
		Name: "rosa",
		Color: "rosa",
		Season: "verano",
		HasStock: false,
	},
];

// ==============================================================================
// EJERCICIO 1

// Hay que mostrar en el HTML los datos de las flores como lista ordenada
// Flor: rosa, de color rojo, florece en primavera y tenemos stock
// Debe aparecer el resultado en #ejercicio1

function buildText(name, color, season, hasStock, price) {
	return `<li>${name}, es de color: ${color}, florece en ${season} y ${
		hasStock ? "" : "no "
	} tenemos stock ${price != null ? "con precio: " + price : null}</li>`;
}

function showList(divId, htmlToRender) {
	let divElement = document.getElementById(divId);
	htmlToRender = "<ol>" + htmlToRender + "</ol>";

	divElement.innerHTML = htmlToRender;
}

exercise1();

function exercise1() {
	let orderedListEx1 = "";

	flowers.forEach((currentFlower) => {
		orderedListEx1 += buildText(
			currentFlower.Name,
			currentFlower.Color,
			currentFlower.Season,
			currentFlower.HasStock,
			currentFlower.Price ?? null
		);
	});

	showList("ejercicio1", orderedListEx1);
}

// ==============================================================================
// EJERCICIO 2
// Listar las flores de color blanco que florecen en verano
// Modelo de mensaje de salida:
// Flor: rosa, de color blanco, florece en verano y tenemos stock
// Debe aparecer el resultado en #ejercicio2

let orderedListEx2 = "";

flowers.forEach((currentFlower) => {
	if (currentFlower.Color == "blanco" && currentFlower.Season == "verano") {
		orderedListEx2 += buildText(
			currentFlower.Name,
			currentFlower.Color,
			currentFlower.Season,
			currentFlower.HasStock
		);
	}
});

showList("ejercicio2", orderedListEx2);

// ==============================================================================
// EJERCICIO 3

// A partir del formulario incluido, hay que mostrar que datos
// corresponden a la selección realizada.
// Se mostrarán en forma de lista como los modelos anteriores.
// Si no hay ninguna flor que cumpla las condiciones, se mostrará este mensaje:
// "No hay flor que cumpla las condiciones"
// Debe aparecer el resultado en #ejercicio3

let htmlToRender = "";
const formEx3 = document.forms["formEx3"];

formEx3.addEventListener("change", () => {
	htmlToRender = "";
	let orderedList = "<ol>";
	const currentColor = formEx3["color"].value;
	const currentSeason = formEx3["season"].value;
	const currentStock = formEx3["stock"].value;
	let hasFlowers = false;

	flowers.forEach((currentFlower) => {
		if (
			(currentFlower.Color == currentColor ||
				currentColor == "cualquiera") &&
			(currentFlower.Season == currentSeason ||
				currentSeason == "cualquiera") &&
			(String(currentFlower.HasStock) == currentStock ||
				currentStock == "cualquiera")
		) {
			orderedList += buildText(
				currentFlower.Name,
				currentFlower.Color,
				currentFlower.Season,
				currentFlower.HasStock
			);
			hasFlowers = true;
		}
	});

	console.log(orderedList);

	if (!hasFlowers) {
		htmlToRender = "No hay items que cumplan las condiciones";
	} else {
		htmlToRender += orderedList + "</ol>";
	}

	showList("ejercicio3", htmlToRender);
});

// ==============================================================================
// EJERCICIO 4

// Haz un formulario para obtener una flor por su nombre
// Si no la encuentra mostrar: "No hay una flor con ese nombre"
// Debe aparecer el resultado en #ejercicio4

function searchFlower(event) {
	event.preventDefault();
	let input = document.getElementById("buscador").value;

	let searchedFlowers = flowers.filter((x) => x.Name.includes(input));

	console.log(searchedFlowers);

	let htmlToRender = "<ol>";
	if (searchedFlowers.length > 0) {
		searchedFlowers.forEach((currentFlower) => {
			htmlToRender += buildText(
				currentFlower.Name,
				currentFlower.Color,
				currentFlower.Season,
				currentFlower.HasStock
			);
		});

		htmlToRender += "</ol>";
	} else {
		htmlToRender = "No hay items que cumplan las condiciones";
	}
	showList("ejercicio4", htmlToRender);
}

// ==============================================================================
// EJERCICIO 5

// Haz un formulario para añadir flores al array.
// Por ejemplo:
// flor: cyclamen, color:rosa, floracion: invierno, stock:true
// Tiene que actualizarse automáticamente la lista del ejercicio 1
// Consigue persistencia con LocalStorage

let form5 = document.forms["formEj5"];

form5.addEventListener("submit", (e) => {
	e.preventDefault();

	let newFlower = {
		Name: document.getElementById("nombreEj5").value,
		Color: document.getElementById("colorEj5").value,
		Season: document.getElementById("floracionEj5").value,
		HasStock: document.getElementById("trueEj5").checked ?? false,
	};

	flowers.push(newFlower);
	exercise1();
});

// ==============================================================================
/* E X T R A S */

// ==============================================================================
// EJERCICIO 6

// Crea y programa un formulario para añadir precios a las flores:
// rosa roja : 8.00€
// rosa blanca : 10.00€
// jazmin: 12.00€
// crisantemo: 5.00€
// cerezo: 25.00€
// cyclamen: 4.50€
// Tiene que actualizarse automáticamente la lista del ejercicio 1

function fillSelectors(selectorId) {
	console.log(selectorId);
	let flowerDropDown = document.getElementById(selectorId);
	let htmlToRender2 = "";

	flowers.forEach((x) => {
		htmlToRender2 += `<option value="${x.Name}">${x.Name}</option>`;
	});

	flowerDropDown.innerHTML = htmlToRender2;
}

fillSelectors("availableFlowers");

const form6 = document.forms["addPriceForm"];

form6.addEventListener("submit", (e) => {
	e.preventDefault();

	let selectedName = document.getElementById("availableFlowers").value;
	let selectedPrice = document.getElementById("flowerPrice").value;

	let index = flowers.map((x) => x.Name).indexOf(selectedName);
	flowers[index] = { ...flowers[index], Price: selectedPrice };

	console.log(flowers);
	exercise1();
	document.getElementById("flowerPrice").value = 0;
});

// ==============================================================================
// EJERCICIO 7

// Crea la forma de eliminar elementos del array
// Tiene que actualizarse automáticamente la lista del ejercicio 1

fillSelectors("availableFlowers2");

function deleteFlower() {
	let selectedName = document.getElementById("availableFlowers2").value;
	let index = flowers.map((x) => x.Name).indexOf(selectedName);

	flowers.splice(index, 1);
	fillSelectors("availableFlowers");
	fillSelectors("availableFlowers2");
	exercise1();
}

// ==============================================================================
// EJERCICIO 8

// Crea la forma de editar elementos del array de flores
// Todas las propiedades deben poder ser editadas: nombre, color, floración, stock  y precio
// Tiene que actualizarse automáticamente la lista del ejercicio 1


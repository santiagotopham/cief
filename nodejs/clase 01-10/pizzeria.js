// ENUNCIADO

// 1 - Mostrar el menú con las opciones:

// Menú de la pizzeria
// ===================

// A. Masa normal
// B. Masa espelta
// ....
// 1. tomate
// ...

let title = "\n Menú de la pizzeria";
const ingredientes = require("./ingredientes.js");

console.log(title);
console.log("=".repeat(title.length), "\n");

console.log("Tipo de masa: \n");
for (const currentDough of ingredientes.DoughTypes) {
	console.log(`${currentDough.Option}. ${currentDough.Name}`);
}

console.log("\n Toppings: \n");
ingredientes.Toppings.forEach(function (currentTop, i) {
	console.log(`${i}. ${currentTop.Name}`);
});

// Al ejecutar el fichero el usuario hace la elección
// de los ingredientes, pero hay que respetar estas
// condiciones:

// 1) Tiene que elegir un tipo de masa, pero solo uno
// 2) Tiene que elegir como mínimo tres ingredientes y
// como máximo cinco. Si elige menos, mostraremos
// un mensaje de error, si eleige más de 5, sólo
// utilizaremos los cinco primeros.

function GetDoughByOption(option) {
	return ingredientes.DoughTypes.find((x) => x.Option == option);
}

function GetToppingsByOption(option) {
	return ingredientes.Toppings.find((x) => x.Option == option);
}

// Ejemplo:
// node ./pizzeria.js C 1 3 5 6
const baseProcessPosition = 2;
const selectedDoughType = GetDoughByOption(process.argv[baseProcessPosition]);
const selectedToppings = [];
let toppingsMessage = "";
const minToppings = 3;
const maxToppings = 5;

for (let i = 1; i <= maxToppings; i++) {
	let currentTop = GetToppingsByOption(process.argv[baseProcessPosition + i]);

	if (currentTop != undefined && currentTop != null) {
		selectedToppings.push(currentTop);
		toppingsMessage += `${currentTop.Name}, `;
	}
}

toppingsMessage = toppingsMessage.slice(0, toppingsMessage.length - 2);

// Con esto, indicaremos al usuario que ha elegido y cuanto cuesta.
// "Preparamos tu pizza con masa sin gluten, tomate, champiñones, parmesano, bacon."
// "Precio: 14.40€"

if (
	selectedToppings.length < minToppings ||
	selectedToppings.length > maxToppings
) {
	console.log(
		`\n Debe seleccionar minimo ${minToppings} toppings y maximo ${maxToppings}`
	);
} else {
	console.log(
		`\n Preparamos tu pizza con ${selectedDoughType.Name}, ${toppingsMessage}.`
	);
}

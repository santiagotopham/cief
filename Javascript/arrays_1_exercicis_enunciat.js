// Se te proponen una serie de ejercicios para practicar
// los arrays y el bucle for.

// Para resolver NO hay que utilizar ninguna función matemática
// Crea el código necesario para resolver los requerimientos

// Dado este array:
let arrayNumeros1 = [4, 5, 3, 8, 2, 7, 1, 6];
// let arrayNumeros2 = [4, 2, 7, 1, 6];
// o cualquier otro array solo con números

// 1) Mostrar por consola la suma de todos los valores

let numbersTotal = 0;

for (let number of arrayNumeros1) {
	numbersTotal += number;
}

console.log(numbersTotal);

// 2) Mostrar por consola el promedio

var average = numbersTotal / arrayNumeros1.length;

console.log(average);

// 3) Encontrar los valores máximo y mínimo

let maxNumber = 0;
let minNumber = arrayNumeros1[0];

for (let number of arrayNumeros1) {
	if (number > maxNumber) {
		maxNumber = number;
	}

	if (number < minNumber) {
		minNumber = number;
	}
}

console.log(maxNumber);
console.log(minNumber);

// 4) Sumar los valores con índice par y restar los impares

let totalEven = 0;
let totalUneven = 0;

for (let i = 0; i < arrayNumeros1.length; i++) {
	if (i % 2 == 0) {
		totalEven += arrayNumeros1[i];
	} else {
		totalUneven -= arrayNumeros1[i];
	}
}

// Hay que mostrar por consola cada resultado
console.log(totalEven);
console.log(totalUneven);

// ====================================================================================================

// Para este array:
let arrayNombres2 = [
	"Clint",
	"Robert",
	"James",
	"Anne",
	"Ingrid",
	"John",
	"Patricia",
	"Marie",
];

// 5) Programa el código para encontrar el elemento con el texto más largo
// y guardarlo en la variable varTextoMasLargo
// Si hay más de un valor, guardarlos en el array arrayTextosMasLargos.

let arrayTextosMasLargos = [];
let varTextoMasLargo = arrayNombres2[0];

for (currentName of arrayNombres2) {
	if (currentName.length > varTextoMasLargo.length) {
		varTextoMasLargo = currentName;
		arrayTextosMasLargos = [currentName];
	} else if (currentName.length === varTextoMasLargo.length) {
		arrayTextosMasLargos.push(currentName);
	}
}

console.log(varTextoMasLargo);
console.log(arrayTextosMasLargos);

// 6) Lo mismo para el texto más corto.

let arrayTextosMasCortos = [];
let varTextoMasCorto = arrayNombres2[0];

for (currentName of arrayNombres2) {
	if (currentName.length < varTextoMasCorto.length) {
		varTextoMasCorto = currentName;
		arrayTextosMasCortos = [currentName];
	} else if (currentName.length === varTextoMasCorto.length) {
		arrayTextosMasCortos.push(currentName);
	}
}

console.log(varTextoMasCorto);
console.log(arrayTextosMasCortos);

// 7) Obtén un array llamado longitudNombres que tenga como elementos las longitudes de los textos
// incluidos en cualquiera de los arrays anteriores. Por tanto debes mostrar : [ 5, 6, 5, etc.

let longitudNombres = [];

for (currentName of arrayNombres2) {
	longitudNombres.push(currentName.length);
}

console.log(longitudNombres);

// ====================================================================================================

// Dado este array:
let arrayMixto = ["Marie", 24, "Pol", 18, "Judith", 22, "Eva", 28];

// 9) Debes obtener otro array llamado arrayBidimensional que sea así:
// [ ["Marie", 24 ], ["Pol", 18], ["Judith", 22 ], [ "Eva", 28] ]

let arrayBidimensional = [];

for (let i = 0; i < arrayMixto.length; i = i + 2) {
	console.log(arrayMixto[i]);
	arrayBidimensional.push([arrayMixto[i], arrayMixto[i + 1]]);
}

console.log(arrayBidimensional);

// ====================================================================================================

// 10) Este array incluye una operación de compra:
const compra = [
	["Leche", 1.2, 2],
	["Pan", 0.8, 3],
	["Huevos", 2.5, 1],
	["Café", 5.2, 0.5],
];
// Se muestra el nombre del artículo, su precio y la cantidad comprada.
// Debes obtener la cantidad de artículos comprados (no de cada tipo) y el importe total.
// Por ejemplo: "Has comprado 4 artículos y el importe total es de 12.7 euros"

let cantItems = 0;
let totalPrice = 0;

for (item of compra) {
	cantItems += item[2];
	totalPrice += item[1] * item[2];
}

console.log(
	`Has comprado ${cantItems} artículos y el importe total es de ${totalPrice} euros`
);

// Después añade otro articulo al array anterior y muestra de nuevo el mensaje informativo con los nuevos datos.

cantItems = 0;
totalPrice = 0;
compra.push(["Manteca", 0.7, 1]);

for (item of compra) {
	cantItems += item[2];
	totalPrice += item[1] * item[2];
}

console.log(
	`Has comprado ${cantItems} artículos y el importe total es de ${totalPrice} euros`
);

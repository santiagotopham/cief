// alert("hola mundo");

var asd = 1;

console.log(asd);

let resultado = 1 + 2;
resultado = 1.5 + 1.5;
resultado = 2 - 1;
resultado = 2 * 3;
resultado = 4 / 5;
resultado = 2 * 2 * 2 * 2;
resultado = 2 ** 4;
resultado = 16 ** (1 / 2);
resultado = 8 ** (1 / 3);
resultado = 4 % 2;
resultado = 9 / 2;
resultado = 1476 % 2;
resultado = 3 < 5;
resultado = 4 < 4;
resultado = 4 > 4;
resultado = 4 == 4;
resultado = 4 == "4";
resultado = 4 === 4;
resultado = 4 === "4";

console.log(resultado);

let num1 = 4;
let num2 = 5;

if (num1 < num2) {
	console.log(`${num1} es menor que ${num2}`);
} else {
	console.log(`${num2} es mayor que ${num1}`);
}

let day = "lunes";
let food;

if (day == "lunes") {
	food = "pizza";
} else if (day == "martes") {
	food = "ensalada";
} else if (day == "miercoles") {
	food = "fricando";
} else if (day == "jueves") {
	food = "paella";
} else if (day == "viernes") {
	food = "hamburguesa";
} else if (day == "sabado") {
	food = "salmorejo";
} else if (day == "domingo") {
	food = "lentejas";
} else {
	food = "pan duro";
}

console.log(`Hoy ${day} se come ${food}`);

switch (day) {
	case "lunes":
		food = "pizza";
		break;
	case "martes":
		food = "esalada";
		break;
	case "miercoles":
		food = "fricando";
		break;
	case "jueves":
		food = "paella";
		break;
	case "viernes":
		food = "hamburguesa";
		break;
	case "sabado":
		food = "salmorejo";
		break;
	case "domingo":
		food = "lentejas";
		break;
	default:
		food = "pan duro";
		break;
}

console.log(`Hoy ${day} se come ${food}`);

let texto = "abracadabra";
let texto2 = texto.replace("a", "i");
let texto3 = texto.replaceAll("a", "i");

console.log(texto2);
console.log(texto3);

let comparacion = texto.localeCompare(texto2);
console.log(comparacion);

let comparacion2 = texto.localeCompare("abracadabra");
console.log(comparacion2);

console.log(texto.includes("e"));
console.log(texto.includes("a"));
console.log(texto.includes("bra"));

let arrayFrutas = ["frutilla", "naranja", "manzana"];

console.log(arrayFrutas);

let otroArray = [1, 1.4, "text", [2, "hola"]];

console.log(otroArray);

arrayFrutas.push("banana");

console.log(arrayFrutas);

console.log(arrayFrutas.length);

arrayFrutas[1] = "sandia";

console.log(arrayFrutas);

console.log(arrayFrutas[2]);
console.log(arrayFrutas[2][3]);

arrayFrutas.pop();
console.log(arrayFrutas);

[1, 2, 3, 4].push(5);
[1, 2, 3, 4].unshift(1);
[1, 2, 3, 4].pop();
[1, 2, 3, 4].shift();
// [1, 2, 1, 4].filter(1);
// [1, 2, 1, 4].map((1) => 2);
[1, 2, 3, 4].join("-");
[1, 2].concat([3, 4]);
[1, 2, [3, 4]].flat();
[1, 2, 3, 4].slice(1, 3);

var text = "Son las";
var daytime = "12:53:00";
var answer = `${text} ${daytime}`;

console.log(answer);

daytime = "13:03";
var answer = `${text} ${daytime}`;
console.log(answer);

let arrayFrutas2 = ["ciruela", "manzana", "anana", "banana"];

for (let i = 0; i < arrayFrutas2.length; i++) {}

for (fruta of arrayFrutas2) {
}

arrayFrutas2.push("uva");
console.log(arrayFrutas2);
arrayFrutas2.pop();
console.log(arrayFrutas2);
arrayFrutas2.unshift("naranja");
console.log(arrayFrutas2);
arrayFrutas2.shift();
console.log(arrayFrutas2);

arrayFrutas2.splice(1, 0, "frutilla");
console.log(arrayFrutas2);

frutasSlice = arrayFrutas2.slice(1, 3);
console.log(frutasSlice);

arrayFrutas2.reverse();
console.log(arrayFrutas2);

let numeros = [1, 4, 2, 7, 6, 3, 9, 10, 5, 8];
numeros.sort();
console.log(numeros);

let frutasOrdenadas = arrayFrutas2.toSorted();
console.log(frutasOrdenadas);

//funciones de flecha
let resultado1 = function (num1, num2) {
	return num1 + num2;
};

console.log(resultado1(1, 4));

let resultado2 = (num1, num2) => {
	return num1 + num2;
};

console.log(resultado2(3, 5));

let resultado3 = (num1, num2) => num1 + num2;

console.log(resultado3(2, 8));

let resultado4 = (num1) => num1 ** 3;

console.log(resultado4(5));

let numeros5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let arrayFiltrado = numeros5.filter((x) => x % 2 == 0);
console.log(arrayFiltrado);

let arrayFiltrado2 = [1, 3, 5, 7].filter((x) => x !== 5);
console.log(arrayFiltrado2);

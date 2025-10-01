// console.log(process.argv);

// console.log("Hola, ", process.argv[2], "!");

// const numero = process.argv[2];
// let index = 1;

// let encabezado = `Tabla del ${numero}`;
// console.log(encabezado);
// console.log("=".repeat(encabezado.length));
// while (index <= 10) {
// 	console.log(`${numero} * ${index} = ${numero * index}`);

// 	index++;
// }

// const idioma = process.argv[2];
// let mensaje = "";

// switch (idioma) {
// 	case "ESP":
// 		mensaje = "Buen dia!";
// 		break;
// 	case "FRA":
// 		mensaje = "Bon jour!";
// 		break;
// 	case "ENG":
// 		mensaje = "Good morning!";
// 		break;
// 	case "CAT":
// 		mensaje = "Bon dia!";
// 		break;
// 	default:
// 		mensaje = "Bla bla!";
// }

// console.log(mensaje);

const idiomas = require("./idiomas.js");
const idioma = process.argv[2];

if (idioma in idiomas) {
	console.log(idiomas[1]);
}

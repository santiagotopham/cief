//FS = File System
const fs = require("node:fs");

let texto = "En un lugar de la Mancha";
fs.writeFileSync("El Quijote.txt", texto, (error) => {
	if (error) {
		throw error;
	}
	console.log("Escritura texto 1 terminada");
});

let texto2 = "de cuyo nombre no quiero acordarme";
fs.appendFileSync("El Quijote.txt", texto2, (error) => {
	if (error) {
		throw error;
	}
	console.log("Escritura texto 2 terminada");
});

let texto3 = "\n esto se escribe en otra linea";
fs.appendFileSync("El Quijote.txt", texto3, (error) => {
	if (error) {
		throw error;
	}
	console.log("Escritura texto 3 terminada");
});

const textoLeido = fs.readFileSync("El Quijote.txt", "utf-8", (error) => {
	if (error) {
		throw error;
	}
	console.log("lectura realizada sin problemas");
});
console.log(textoLeido);

fs.unlinkSync("El Quijote.txt", (error) => {
	if (error) {
		throw error;
	}
	console.log("archivo borrado");
});

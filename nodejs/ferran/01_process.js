// console.log(process.argv)
// Hola, Ferran !
// console.log("Hola,", process.argv[2], "!");

// Vamos a añadir después del nombre 
// del fichero un número (en el ejemplo lo llamo Z)
// y debemos obtener la tabla de multiplicar de ese número
// desde el 1 hasta el 10:
// Tabla del Z
// ===========
// Z x 1 = Z
// ...
// Z x 10 = ..

// console.log(process.argv[2]);
const num = process.argv[2]

// let mensaje;
let mensaje = `TABLA DEL ${num}`
// console.log(mensaje.length);
mensaje += "\n" + "=".repeat(mensaje.length) 
for (let i = 1; i <= 10; i++) {
    mensaje += `\n${num} x ${i} = ${num * i}`
}


// console.log(mensaje);

// Vamos a poner al final del nombre del fichero
// un código de idioma (esp, fra, eng, cat, ...)
// fra -> Bonjour!
// eng -> Good morning!
// node 01_process.js eng -> Good morning!

const codigo = process.argv[2]

// Solución 1
if (codigo == "esp") {
    console.log("Buenos días");
} else if (codigo == "fra") {
    console.log("Bonjour");
} else if (codigo == "eng") {
    console.log("Good morning");
} else if (codigo == "cat") {
    console.log("Bon dia");
} else {
    console.log("idioma no reconocido");
}

// Solución 2
switch (codigo) {
    case "esp":
        console.log("Buenos días");
        break;
    case "eng":
        console.log("Good morning");
        break;
    case "fra":
        console.log("Bonjour");
        break;
    case "cat":
        console.log("Bon dia");
        break;
    default:
        console.log("idioma no reconocido");
}

// Solución 3

// const saludo = {
//     "esp": "Buenos días",
//     "fra": "Bonjour",
//     "eng": "Good morning",
//     "cat": "Bon dia"
// }

const saludo = require('./idiomas.js')

if (codigo in saludo) {
    console.log(saludo[codigo]);
} else {
    console.log("idioma no reconocido");
}



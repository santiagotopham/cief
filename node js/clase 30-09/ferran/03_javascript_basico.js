// Maneras de guardar datos en variables
let nombre = "Anna"
const PI = 3.1416
var apellido = "Pou"
// let edad = 15
// edad = 16 <- Esto NO debemos hacerlo

// {
//     let nombre = "Pau" 
    
// }

// Colecciones
let unArray = []
let unObjeto = {}

//         0  1  2  3  4
unArray = [1, 2, 3, 4, 5]
console.log(unArray[2]); // 3

unObjeto = { nombre: "Anna", "el apellido": "Garcia"}
console.log(unObjeto['nombre']);
console.log(unObjeto.nombre);
console.log(unObjeto["el apellido"]);

console.log(unObjeto[0]);

console.log(1/0);

console.log("otro texto");

unArray.push(6)
console.log(unArray);
unArray.pop()
console.log(unArray);
unArray.unshift(0)
console.log(unArray);
unArray.shift()
console.log(unArray);

// if
// if - else
// if - elseif - else
// if - elseif

// switch

// while o do-while

// for() - forin - forof - forEach()

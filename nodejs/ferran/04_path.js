// Fomas de llamar a un modulo
// 1) Forma antigua -> commonjs
// const path = require("node:path");

// 2) forma moderna
import path from "node:path";

//Windows: C:\Windows\DiagTrack
// Mac + Linux: /dev/etc/

// Que separador utiliza nuestro SO
console.log(path.sep);

// join() para unir elementos
const ruta = path.join("proyectos", "node", "node_01", "04_path.js");
console.log(ruta);

//nombre del fichero
const fichero = path.basename(ruta);
console.log(fichero);

// ruta excepto el fichero
const ruta2 = path.dirname(ruta);
console.log(ruta2);

// directorio inicial del proyecto
console.log(__dirname); // solo valido con common js
// import path from 'path';
// import {fileURLToPath} from 'url';
// const __filename = fileURLToPath(import.meta.url);
// // 👇️ "/home/john/Desktop/javascript"
// const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);
// // 👇️ "/home/borislav/Desktop/javascript/dist/index.html"
// console.log(path.join(__dirname, '/dist', 'index.html'));

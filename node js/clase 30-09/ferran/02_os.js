// os -> Operating System
const os = require('node:os')

// Memòria libre = disponible en bytes
console.log(os.freemem(), "bytes");

// Memòria libre = disponible en kilobytes
console.log(os.freemem()/ (1024), "kilobytes");

// Memòria libre = disponible en megabytes
console.log(os.freemem()/ (1024*1024), "megabytes");

// Memòria libre = disponible en megabytes
console.log((os.freemem()/ (1024*1024*1024)).toFixed(2), "gigabytes");

// Hay 8 núcleos
console.log("Hay", os.cpus().length, "núcleos");


// Memòria libre = disponible en megabytes
console.log(os.freemem()/ (1024*1024), "megabytes");

// Nombre del equipo
console.log(os.hostname());

// Versión del sistema
console.log(os.release());

// Información del usuario
console.log(os.userInfo().username);
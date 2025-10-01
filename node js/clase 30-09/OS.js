const os = require("os");

console.log(os.freemem());

console.log(os.freemem() / (1024 * 1024 * 1024));

console.log(os.cpus());

console.log("Hay ", os.cpus().length, " hilos");

console.log(os.hostname());

console.log(os.release());

const http = require("node:http");

const PORT = 3000;

//peticion = request => req
//respuesta = response => res
const server = http.createServer((req, res) => {
	res.end("hola mundo");
});

server.listen(PORT, () => {
	console.log(`Server inicializado en: http://localhost:${PORT}`);
});

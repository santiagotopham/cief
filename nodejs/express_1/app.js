const express = require("express");
const path = require("node:path");

const PORT = 8888;
const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
	//// res.json({ message: "hello" });
	res.send("<h1>titulo</h1>");
});

app.listen(PORT, (error) => {
	if (error) console.log(`Error interno al levantar servicio : ${error}`);
	console.log(`Escuchando en Puerto: http://localhost:${PORT}`);
});

app.get("/api", (req, res) => {
	res.json({ curso: "node", tema: "express" });
});

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, "static", "404.html"));
});

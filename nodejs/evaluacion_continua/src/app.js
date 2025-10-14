const express = require("express");
const morgan = require("morgan");
const path = require("node:path");

const app = express();

process.loadEnvFile();
const PORT = process.env.PORT;

app.set("views", "../views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("hola mundo");
});

app.use((req, res) => {
	// res.render("404", { title: "Error 404" });
	res.send("404");
});

app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

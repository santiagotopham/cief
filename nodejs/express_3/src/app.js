const express = require("express");
const path = require("node:path");

const app = express();

process.loadEnvFile();
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, "../static")));

// Para definir el tipo de plantilla
app.set("view engine", "ejs");
// Para indicar donde pondremos las vistas
app.set("views", "./views");

app.get("/", (req, res) => {
	// res.send() <- un texto
	// res.sendFile <- un fichero
	// res.json <- APIs, envía un fichero JSON
	// res.render <- plantillas
	console.log(__dirname);
	// res.sendFile("index.html")
	res.render("index", {
		titulo: "Soy una plantilla EJS",
		descripcion:
			"<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse est laudantium error deserunt ad ducimus incidunt quae eligendi asperiores nihil odit voluptas distinctio nulla rerum tempora, ipsum quisquam perferendis vitae fuga necessitatibus voluptatem aliquid porro ipsa! Rerum alias molestiae cupiditate repudiandae. In optio deleniti veritatis vel numquam quod aspernatur suscipit.</p>",
		script: "<script>alert('Hola que ase?')</script>",
	});
});

app.get("/aulas", (req, res) => {
	res.render("tipo", {
		titulo: "Nuestras aulas",
		descripcion:
			"Nuestras aulas están perfectamente equipadas para la docencia actual.",
		imagen1:
			"https://plus.unsplash.com/premium_photo-1680807869780-e0876a6f3cd5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		imagen2:
			"https://images.unsplash.com/photo-1604134967494-8a9ed3adea0d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	});
});

app.use((req, res) => {
	res.status(404).send(
		"<h1>Error 404: Esta ruta no existe en el servidor.</h1>"
	);
});

app.listen(PORT, () => {
	console.log(`Servidor operativo en http://localhost:${PORT}`);
});

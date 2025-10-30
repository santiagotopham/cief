// Cargar los módulos para poderlos utilizar
const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const methodOverride = require("method-override"); // para "put"
const mysql = require("mysql2/promise");

// Crear la instancia del servidor
const app = express();

// Configurar algunos parámetros
process.loadEnvFile();
PORT = process.env.PORT || 6666;
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
const configConnection = {
	host: process.env.host,
	port: process.env.db_port,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
};

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function crearMenu(json, lang) {
	let tipusProductes = [];
	let menu = "<ul>";

	if (lang === "cat") {
		json.forEach((producte) => {
			if (!tipusProductes.includes(producte.menu_name_cat)) {
				tipusProductes.push(producte.menu_name_cat);
			}
		});
	} else {
		json.forEach((producte) => {
			if (!tipusProductes.includes(producte.menu_name_esp)) {
				tipusProductes.push(producte.menu_name_esp);
			}
		});
	}

	tipusProductes.forEach((tipus) => {
		menu += `<li><a href="/${tipus.toLocaleLowerCase()}">${tipus}</a></li>`;
	});
	menu += "</ul>";
	return menu;
}

// Ruta català
app.get("/", async (req, res) => {
	// Realizar el menú
	const products = await getProductsFromDb();
	const menu = crearMenu(products, "cat");
	res.render("index", {
		title: "Umm...!",
		menu,
		productes: products,
		lang: "ESP",
	});
});
// Ruta raíz o inicial
app.get("/esp", async (req, res) => {
	const products = await getProductsFromDb();
	const menu = crearMenu(products, "esp");
	res.render("inicio", { title: "Umm...!", menu, productes: products });
});

app.get("/admin", async (req, res) => {
	const products = await getProductsFromDb();
	const menu = crearMenu(products, "esp");
	res.render("admin", { title: "Gestió", menu, productes: products });
});

// app.post("/insert", (req, res) => {
// 	const body = req.body;
// 	body.id = crypto.randomUUID();
// 	//console.log(body);
// 	productes.push(body);
// 	fs.writeFileSync(
// 		path.join(__dirname, "../data", "pastisseria.json"),
// 		JSON.stringify(productes, null, 2),
// 		(err) => {
// 			if (err) throw err;
// 		}
// 	);
// 	// res.render("admin", { title: "administración", menu, travels });
// 	res.redirect("/admin");
// });

app.post("/insert", async (req, res) => {
	const newProduct = req.body;

	await createProduct(newProduct);

	res.redirect("/admin");
});

// Ruta para manejar errores 404
app.use((req, res) => {
	res.render("404", { title: "Error 404", menu });
});

app.listen(PORT, () => {
	console.log(`Servidor arrancado en http://localhost:${PORT}`);
});

//Gestion de datos
async function openDbConnection() {
	return await mysql.createConnection(configConnection);
}

async function getProductsFromDb() {
	const connection = await openDbConnection();
	const query = "SELECT * FROM sweets";

	const [products] = await connection.query(query);
	await connection.end();

	return products;
}

async function createProduct(newProduct) {
	const connection = await openDbConnection();
	const sql =
		"INSERT INTO `sweets`(`menu_name_cat`, `name_cat`, `descripcio_cat`, `menu_name_esp`, `name_esp`, `descripcio_esp`, `preu`, `img`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	const values = [
		newProduct.menu_name_cat,
		newProduct.name_cat,
		newProduct.descripcio_cat,
		newProduct.menu_name_esp,
		newProduct.name_esp,
		newProduct.descripcio_esp,
		newProduct.preu,
		newProduct.img,
	];

	await connection.execute(sql, values);
	await connection.end();
}

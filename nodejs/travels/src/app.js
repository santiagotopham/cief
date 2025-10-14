// Cargar los módulos para poderlos utilizar
const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const methodOverride = require("method-override"); // para "put"
const morgan = require("morgan");

// Crear la instancia del servidor
const app = express();

// Configurar algunos parámetros
process.loadEnvFile();
PORT = process.env.PORT;
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

// Middlewares
// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Obtener los datos
let travels = require("../data/travels.json");

function crearMenu( json) {
  let menu = '<ul class="container">';
travels.forEach((travel) => {
  menu += `<li><a href="${travel.ruta}">${travel.lugar}</a></li>`;
});
menu += "</ul>";
return menu
}
// Realizar el menú
menu = crearMenu(travels)

// Ruta raíz o inicial
app.get("/", (req, res) => {
  res.render("index", { title: "Express Travels", menu: menu });
});

// app.get("/:destino", (req, res) => {
//     const destino = "/"+req.params.destino

//     let h2 = ""
//     let nombre = ""
//     let descripcion = ""
//     let img = ""
//     let precio = 0

//     travels.forEach(travel => {
//         if (destino == travel.ruta) {
//             h2 = travel.lugar
//             nombre = travel.nombre
//             descripcion = travel.descripcion
//             img = travel.img
//             precio = travel.precio
//         }
//     })
//     if (h2.length === 0) {
//         return res.status(404).render('404', { title : "Error 404", menu: menu})
//     }

//     res.render('viaje', { title : h2, menu, img, nombre, descripcion, precio})
// })

travels.forEach((travel) => {
  app.get(`${travel.ruta}`, (req, res) => {
    res.render("viaje", {
      title: `${travel.lugar}`,
      menu,
      img: `${travel.img}`,
      nombre: `${travel.nombre}`,
      descripcion: `${travel.descripcion}`,
      precio: `${travel.precio}`,
    });
  });
});

app.get("/admin", (req, res) => {
  res.render("admin", { title: "administración", menu, travels });
});

app.post("/insert", (req, res) => {
  const body = req.body;
  body.id = crypto.randomUUID();
  //console.log(body);
  travels.push(body);
  fs.writeFileSync(
    path.join(__dirname, "../data", "travels.json"),
    JSON.stringify(travels, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
  // res.render("admin", { title: "administración", menu, travels });
  res.redirect("/admin")
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  let newTravels = travels.filter((travel) => travel.id != id);
  console.log(newTravels);

  fs.writeFileSync(
    path.join(__dirname, "../data", "travels.json"),
    JSON.stringify(newTravels, null, 2),
    (err) => {
      if (err) res.json({ mensaje: "problema con el borrado" });
    }
  );
  menu = crearMenu(newTravels)
  // res.render("admin", { title: "administración", menu, travels: newTravels });
  
  res.json({"mensaje" : "borrado ok"})
});

app.post("/update", (req, res) => {
  // body es un objeto con los datos actualizados del formulario 
  const body = req.body;

  // Obtenemos el id del viaje actualizado
  const id = body.id;

  // Filtramos por todos los viajes que NO son el del id anterior
  let newTravels = travels.filter((travel) => travel.id != id);
  // Añadimos los datos actualizados
  newTravels.push(body);
  // Escribimos el fichero con los datos
  fs.writeFileSync(
    path.join(__dirname, "../data", "travels.json"),
    JSON.stringify(newTravels, null, 2),
    (err) => {
      if (err) res.json({ mensaje: "problema con el borrado" });
    }
  );
  menu = crearMenu(newTravels)
  // Reenviamos a la plantilla "admin" los datos actualizados (newTravels)
  res.render("admin", { title: "administración", menu, travels: newTravels });
});

app.use((req, res) => {
  res.render("404", { title: "Error 404", menu });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});

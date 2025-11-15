import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import morgan from "morgan";
import gamesRoutes from "../routes/games.routes.js";
import genresRoutes from "../routes/genres.routes.js";
import platformsRoutes from "../routes/platforms.routes.js";
import usersRoutes from "../routes/users.routes.js";
import commentsRoutes from "../routes/comments.routes.js";
import searchRoutes from "../routes/search.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import pageRoutes from "../routes/page.routes.js";

//////////////////////////////////////////////////////////////////////////////	CONFIGURACIONES INICIALES	/////////////////////////////////////////////////////////////////////////////

const app = express();

process.loadEnvFile();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//////////////////////////////////////////////////////////////////////////////	RUTAS	///////////////////////////////////////////////////////////////////////////////////////////

app.use("/", pageRoutes);
app.use("/", searchRoutes);
app.use("/", adminRoutes);
app.use("/", usersRoutes);
app.use("/game", gamesRoutes);
app.use("/genre", genresRoutes);
app.use("/platform", platformsRoutes);
app.use("/comment", commentsRoutes);

////////////////////////////////////////////////////////////////////////////	404   //////////////////////////////////////////////////////////////////////////////

app.use((_req, res) => {
	res.render("404", {
		title: "",
		siteName: "GameRanking",
		showMessage: false,
		subTitle: "Error 404",
		navBarItems: "",
	});
});

//////////////////////////////////////////////////////////////////////////////	SERVER START    //////////////////////////////////////////////////////////////////////////////

//Inicio el servidor
app.listen(PORT, () => {
	console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

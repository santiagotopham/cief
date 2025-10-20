//App initialization
const express = require("express");
const morgan = require("morgan");
const path = require("node:path");

const app = express();

//Load environment variables
process.loadEnvFile();
const PORT = process.env.PORT;
const siteName = "EjsTeam";
const bannerMessage =
	"Somos EJS TEAM, los mejores desarrollando en Node, Express y EJS. Te unes a nosotros?";

//Configure EJS and static content
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../static")));

//Dev env configs
app.use(morgan("dev"));

//Express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//"Database" init
let teamDB = require("../data/team.json");
let departments = getDepartmentsList();
let navBarMenu = buildNavBarMenu();

//Routes
app.get("/", (req, res) => {
	res.render("index", {
		title: siteName,
		siteName: siteName,
		subTitle: "Nuestro equipo",
		bannerMessage: bannerMessage,
		navBarItems: navBarMenu,
		teamMembers: teamDB,
	});
});

//Error handling
app.use((req, res) => {
	res.render("404", {
		title: "Error 404",
		siteName: siteName,
		subTitle: "Error 404",
		navBarItems: navBarMenu,
	});
});

//Inicio el servidor
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

//Navbar content
function buildNavBarMenu() {
	let list = '<ul class="container">';
	departments.forEach((currentDepartment) => {
		list += `<li><a href="/department/${currentDepartment.toLocaleLowerCase()}">${currentDepartment}</a></li>`;
	});
	list += "</ul>";
	return list;
}

//Gestion de datos
function getDepartmentsList() {
	let departmentsList = teamDB.map((currentMember) => {
		return currentMember.department;
	});
	// let temp = ;
	return [...new Set(departmentsList)];
}

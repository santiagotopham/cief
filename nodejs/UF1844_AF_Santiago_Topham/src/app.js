//App initialization
const express = require("express");
const morgan = require("morgan");
const path = require("node:path");
const fs = require("node:fs");

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

//Home
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

//Departments (navbar navegation)
departments.forEach((currentDepartment) => {
	app.get(
		`/department/${currentDepartment.toLocaleLowerCase()}`,
		(req, res) => {
			res.render("search", {
				title: siteName,
				siteName: siteName,
				subTitle: `Departamento: ${currentDepartment}`,
				bannerMessage: bannerMessage,
				navBarItems: navBarMenu,
				teamMembers: filterByDepartment(currentDepartment),
			});
		}
	);
});

//Specific results
app.get("/member/:id", (req, res) => {
	let member = getMemberById(req.params.id);

	if (member == null) {
		return res.redirect("/404");
	}

	res.render("result", {
		title: siteName,
		siteName: siteName,
		subTitle: member.name,
		bannerMessage: bannerMessage,
		navBarItems: navBarMenu,
		member: member,
	});
});

//Backoffices
app.get("/backoffice", (req, res) => {
	res.render("backoffice", {
		title: siteName,
		siteName: siteName,
		subTitle: "Backoffice",
		bannerMessage: bannerMessage,
		navBarItems: navBarMenu,
		departments: getDepartmentsList(),
		teamMembers: teamDB,
	});
});

app.post("/insert", (req, res) => {
	const newMember = req.body;
	newMember.id = getMaxId() + 1;
	newMember.foto = buildImagePath(newMember);

	teamDB.push(newMember);
	writeDB(teamDB);
	res.redirect("/backoffice");
});

app.post("/update", (req, res) => {
	const updatedMember = req.body;
	const id = updatedMember.id;
	updatedMember.foto = buildImagePath(updatedMember);

	let teamMembers = getOtherMembers(id);
	teamMembers.push(updatedMember);

	writeDB(teamMembers);

	res.redirect("/backoffice");
});

app.delete("/delete/:id", (req, res) => {
	const id = req.params.id;

	let teamMembers = getOtherMembers(id);

	writeDB(teamMembers);

	res.redirect("/backoffice");
});

//Error handling
app.use((req, res) => {
	res.render("404", {
		title: siteName,
		siteName: siteName,
		subTitle: null,
		bannerMessage: null,
		navBarItems: navBarMenu,
	});
});

//Inicio el servidor
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

//Navbar content
function buildNavBarMenu() {
	console.log(departments);
	let list = '<ul class="container">';
	departments.forEach((currentDepartment) => {
		list += `<li><a href="/department/${currentDepartment.toLocaleLowerCase()}">${currentDepartment}</a></li>`;
	});
	list += '<li><a href="/backoffice">backoffice</a></li></ul>';
	return list;
}

//Gestion de datos
function getDepartmentsList() {
	let departmentsList = teamDB.map((currentMember) => {
		return currentMember.department;
	});
	return [...new Set(departmentsList)];
}

function filterByDepartment(department) {
	return teamDB.filter((x) => x.department == department);
}

function getMemberById(id) {
	return teamDB.find((x) => x.id == id);
}

function getMaxId() {
	return teamDB.reduce(function (prev, current) {
		return prev && prev.id > current.id ? prev.id : current.id;
	});
}

function getOtherMembers(id) {
	return teamDB.filter((currentMember) => currentMember.id != id);
}

function writeDB(array) {
	fs.writeFileSync(
		path.join(__dirname, "../data", "team.json"),
		JSON.stringify(array, null, 2),
		(err) => {
			if (err) res.json({ mensaje: "problema con el borrado" });
		}
	);
}

function buildImagePath(member) {
	return member.name + "." + member.surname + ".png";
}

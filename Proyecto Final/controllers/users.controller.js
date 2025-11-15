import { isUserValid } from "../services/users.service.js";
import { buildNavBarMenu } from "../services/common.service.js";
import { siteName } from "../config/constants.js";

//Pagina login
export async function renderLogin(req, res) {
	res.render("login", {
		title: siteName,
		siteName,
		showMessage: false,
		subTitle: "Login",
		navBarItems: await buildNavBarMenu(),
	});
}

//Validacion ususario
export async function login(req, res) {
	try {
		const { username, password } = req.body;
		const isValid = await isUserValid(username, password);

		if (!isValid)
			return res
				.status(401)
				.json({ success: false, message: "Credenciales inválidas" });

		res.json({ success: true, message: "Login exitoso" });
	} catch {
		res.status(500).json({ success: false, message: "Error del servidor" });
	}
}

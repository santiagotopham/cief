import {
	getPlatformsList,
	savePlatform,
	updatePlatform,
	deletePlatform,
	getMainPlatforms,
} from "../services/platforms.service.js";

//Obtener todos
export async function getPlatforms(req, res) {
	res.json(await getPlatformsList());
}

//Nuevo
export async function createPlatform(req, res) {
	await savePlatform(req.body);
	res.json({ success: true, message: "Plataforma creada" });
}

//Editar
export async function editPlatform(req, res) {
	await updatePlatform(req.body.id || req.body.Id, req.body);
	res.json({ success: true, message: "Plataforma editada" });
}

//Eliminar
export async function deletePlatformController(req, res) {
	await deletePlatform(req.params.id);
	res.json({ success: true, message: "Plataforma borrada" });
}

//Obtener princiaples/padres
export async function getMainPlatformsController(req, res) {
	res.json(await getMainPlatforms());
}

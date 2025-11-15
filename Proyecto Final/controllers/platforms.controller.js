import {
	getPlatformsList,
	savePlatform,
	updatePlatform,
	deletePlatform,
	getMainPlatforms,
} from "../services/platforms.service.js";

export async function getPlatforms(req, res) {
	res.json(await getPlatformsList());
}

export async function createPlatform(req, res) {
	await savePlatform(req.body);
	res.json({ success: true, message: "Plataforma creada" });
}

export async function editPlatform(req, res) {
	await updatePlatform(req.body.id || req.body.Id, req.body);
	res.json({ success: true, message: "Plataforma editada" });
}

export async function deletePlatformController(req, res) {
	await deletePlatform(req.params.id);
	res.json({ success: true, message: "Plataforma borrada" });
}

export async function getMainPlatformsController(req, res) {
	res.json(await getMainPlatforms());
}

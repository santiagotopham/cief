import { getGamesList } from "../services/games.service.js";
import { getGenresList } from "../services/genres.service.js";
import { getPlatformsList, getMainPlatforms } from "../services/platforms.service.js";
import { buildNavBarMenu } from "../services/common.service.js";
import { siteName } from "../config/constants.js";

// Panel de administración
export async function renderAdminPanel(req, res) {
	res.render("admin", {
		title: siteName,
		siteName: siteName,
		showMessage: false,
		subTitle: "",
		navBarItems: await buildNavBarMenu(),
		games: await getGamesList(false),
		genres: await getGenresList(),
		platforms: await getPlatformsList(),
		mainPlatforms: await getMainPlatforms(),
	});
}

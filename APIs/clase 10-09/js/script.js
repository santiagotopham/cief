import { appid } from "./apikey.js";

const formMeteo = document.forms["formMeteo"];

formMeteo.addEventListener("submit", (e) => {
	e.preventDefault();

	let country = formMeteo["inputPais"].value.trim();
	country = country != "" ? `,${country}` : "";
	let cityName = formMeteo["inputCiudad"].value.trim();
	let language = formMeteo["inputIdioma"].value;

	console.log(country);
	console.log(cityName);
	console.log(language);

	let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}${country}&appid=${appid}&units=metric&lang=${language}`;

	console.log(url);

	let result = "";

	fetch(url)
		.then((data) => data.json())
		.then((data) => {
			console.log(data);
			result += `<p>Clima: ${data["weather"][0]["description"]}</p>`;
			result += `<p>Temperatura actual: ${Math.round(
				data["main"]["temp"]
			)}</p>`;

			result += `<img src="https://www.imelcf.gob.pa/wp-content/plugins/location-weather/assets/images/icons/weather-icons/${data["weather"][0]["icon"]}.svg" alt="icono de clima" />`;

			console.log(result);
			RenderHtml("showResult", result);
		})
		.catch((error) => console.log(error));
});

function RenderHtml(id, htmlToRender) {
	let htmlTag = document.getElementById(id);
	htmlTag.innerHTML = htmlToRender;
}

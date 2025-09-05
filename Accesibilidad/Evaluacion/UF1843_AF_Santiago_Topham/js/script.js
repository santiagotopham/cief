let inputNombre = document.querySelector("#nombre");
let errorNombre = document.querySelector("#errorNombre");
const mensajeErrorNombre =
	"<span>&#9888;</span> Error: por favor, escriba un nombre válido";

inputNombre.addEventListener("change", () => {
	let nombre = inputNombre.value.trim();

	if (nombre.length < 2) {
		inputNombre.value = "";
		errorNombre.innerHTML = mensajeErrorNombre;
		inputNombre.setAttribute("aria-describedby", "errorNombre");
		inputNombre.focus();
	} else {
		inputNombre.removeAttribute("aria-describedby");
		errorNombre.innerHTML = "";
	}
});

let inputOpinion = document.getElementById("opinion");
let errorOpinion = document.getElementById("errorOpinion");
const mensajeErrorOpinion =
	"<span>&#9888;</span> Por favor, necesitamos que su opinión tenga más de 20 caracteres.";

inputOpinion.addEventListener("change", () => {
	let opinion = inputOpinion.value.trim();

	if (opinion.length < 20) {
		errorOpinion.innerHTML = mensajeErrorOpinion;
		inputOpinion.setAttribute("aria-describedby", "errorOpinion");
		inputOpinion.focus();
	} else {
		inputOpinion.removeAttribute("aria-describedby");
		errorOpinion.innerHTML = "";
	}
});

const opinionForm = document.forms["opinion_form"];

opinionForm.addEventListener("submit", (e) => {
	e.preventDefault();
	alert(`Gracias por enviarnos tu opinion ${inputNombre.value}!`);
	opinionForm.reset();
});

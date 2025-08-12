function setTodayDate() {
	const todayDate = new Date().toISOString().split("T")[0];

	document.querySelectorAll(".dateInput").forEach((currentInput) => {
		currentInput.value = todayDate;
		currentInput.min = todayDate;
	});
}

setTodayDate();

const fromDateInput = document.getElementById("fromDate");

fromDateInput.addEventListener("change", () => {
	const toDateInput = document.getElementById("toDate");
	toDateInput.min = fromDateInput.value;
	toDateInput.value = fromDateInput.value;
});

let selectedStayType = "";

document
	.querySelectorAll("input[name='stayType']")
	.forEach((currentRadioInput) => {
		currentRadioInput.addEventListener("change", (e) => {
			removeSelected();

			let label = document.querySelector(
				`label[for="${currentRadioInput.value}"]`
			);
			selectedStayType = label.innerHTML;
			label.classList.add("selected");
		});
	});

function removeSelected() {
	document.querySelectorAll(".radioLabel").forEach((currentLabel) => {
		currentLabel.classList.remove("selected");
	});
}

const hotelForm = document.forms["hotelForm"];

hotelForm.addEventListener("submit", (e) => {
	e.preventDefault();

	let userName = document.getElementById("userName").value;
	let userLastName = document.getElementById("lastName").value;
	let fromDate = document.getElementById("fromDate").value;
	let toDate = document.getElementById("toDate").value;

	let htmlToRender = "";

	htmlToRender += buildText("Reserva realizada a nombre de", [
		userName,
		userLastName,
	]);
	htmlToRender += buildText("Fecha de entrada:", [fromDate]);
	htmlToRender += buildText("Fecha de salida:", [toDate]);
	htmlToRender += buildText("Estancia:", [selectedStayType]);

	showList("dialogListDiv", htmlToRender);

	document.getElementById("dialogWindow").showModal();
});

function resetForm() {
	hotelForm.reset();
	removeSelected();
	setTodayDate();
	let label = document.querySelector(`label[for="onlyStay"]`);
	label.classList.add("selected");
}

function buildText(text, params) {
	let result = `<li><span class="dialogLabel">${text}</span> `;

	if (params != null && params.length > 0) {
		params.forEach((parameter) => {
			result += `${parameter} `;
		});
	}

	result += "</li>";
	return result;
}

function showList(divId, htmlToRender) {
	let divElement = document.getElementById(divId);
	htmlToRender = "<ul>" + htmlToRender + "</ul>";

	divElement.innerHTML = htmlToRender;
}

function closeModal() {
	document.getElementById("dialogWindow").close();
	let divElement = document.getElementById("dialogListDiv");
	divElement.innerHTML = "";
	resetForm();
}

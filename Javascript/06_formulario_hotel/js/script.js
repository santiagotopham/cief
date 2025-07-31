const todayDate = new Date().toISOString().split("T")[0];

document.querySelectorAll(".dateInput").forEach((currentInput) => {
	currentInput.min = todayDate;
});

const fromDateInput = document.getElementById("fromDate");

fromDateInput.addEventListener("change", () => {
	const toDateInput = document.getElementById("toDate");
	toDateInput.min = fromDateInput.value;
	toDateInput.value = fromDateInput.value;
});

document
	.querySelectorAll("input[name='stayType']")
	.forEach((currentRadioInput) => {
		currentRadioInput.addEventListener("change", () => {
			removeSelected();

			let label = document.querySelector(
				`label[for="${currentRadioInput.value}"]`
			);
			label.classList.add("selected");
		});
	});

function removeSelected() {
	document.querySelectorAll(".radioLabel").forEach((currentLabel) => {
		currentLabel.classList.remove("selected");
	});
}
function resetForm() {
	removeSelected();
	document.getElementById("defaultStay").classList.add("selected");
}

const hotelForm = document.forms["hotelForm"];

hotelForm.addEventListener("submit", (e) => {
	e.preventDefault();
	// console.log(e);
	document.getElementById("dialogWindow").showModal();
});

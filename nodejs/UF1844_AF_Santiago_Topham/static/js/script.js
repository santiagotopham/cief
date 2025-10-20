const sectionInsert = document.querySelector(".insert");
const sectionUpdate = document.querySelector(".update");
let isInsert = true;
toggleForm();

function toggleForm() {
	if (sectionInsert.style.display == "block") {
		sectionInsert.style.display = "none";
		sectionUpdate.style.display = "block";
		isInsert = false;
	} else {
		sectionInsert.style.display = "block";
		sectionUpdate.style.display = "none";
		isInsert = true;
	}
}

function loadAndShowEditForm(member) {
	if (isInsert) toggleForm();
	member = JSON.parse(member);

	document.getElementById("id").value = member.id;
	document.getElementById("updateName").value = member.name;
	document.getElementById("updateSurname").value = member.surname;
	document.getElementById("updateEmail").value = member.email;
	document.getElementById("updateKey").value = member.key;
	document.getElementById("updatedateBirth").value = member.dateBirth;
	document.getElementById("updateDepartment").value = member.department;
	document.getElementById("updateAbout").value = member.about;
}

function deleteMember(id) {
	fetch(`/delete/${id}`, {
		method: "DELETE",
	})
		.then((response) => response.json())
		.then(setTimeout(() => location.reload(), 300))
		.catch((error) => console.error("Error:", error));
}

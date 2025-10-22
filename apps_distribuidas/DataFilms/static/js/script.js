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

function loadAndShowEditForm(movie) {
	if (isInsert) toggleForm();
	movie = JSON.parse(movie);

	document.getElementById("id").value = movie.id;
	document.getElementById("updateTitle").value = movie.title;
	document.getElementById("updateImage_url").value = movie.image_url;
	document.getElementById("updateYear").value = movie.year;
	document.getElementById("updateDirector").value = movie.director;
	document.getElementById("updateGenre").value = movie.genre;
	document.getElementById("updateBudget").value = movie.budget;
	document.getElementById("updateSynopsis").value = movie.synopsis;
}

function deleteMovie(id) {
	fetch(`/delete/${id}`, {
		method: "DELETE",
	})
		.then((response) => response.json())
		.then(setTimeout(() => location.reload(), 300))
		.catch((error) => console.error("Error:", error));
}

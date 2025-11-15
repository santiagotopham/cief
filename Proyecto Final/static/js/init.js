//////////////////////////////////////////////////////////////////////////////	CONFIGURACIONES INICIALES	/////////////////////////////////////////////////////////////////////////////
// Key = Id, Value = Name
const selectedGenresMap = new Map();
const selectedPlatformsMap = new Map();

const gameForm = document.getElementById("gameForm");
const genreForm = document.getElementById("genreForm");
const platformForm = document.getElementById("platformForm");

let isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
let isInsert = true;
let filtersOpen = false;

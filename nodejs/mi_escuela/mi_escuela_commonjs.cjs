// Para una escuela de idiomas, hace falta saber:
// 1) que alumnos son menores de edad, ya que se pasa la información de su asistencia a los padres
// 2) que alumnos son mayores de 65, ya que disponen de un descuento en la matrícula, a razón de
// un 5% por cada año que pasen de 64.

// Función que indique para los alumnos menores de edad
// su nombre, cuantos años tienen y cuantos días les faltan para cumplir 18
// De este modo:
// Pepa Pi tienes 17 años y te faltan 32 días para cumplir 18 años.

// Función que indique que alumnos pasan de 65 años, a qué descuento tienen derecho y
// cuanto costaría su matrícula. Por ejemplo:
// Pau Guerra tienes 66 años, tu descuento es del 10% y el importe de tu matrícula es de 225 €

// const fs = require("node:fs");
const alumnosFile = "alumnos_commonjs.cjs";

// const alumnoFS = fs.readFileSync(alumnosFile, "utf-8", (error) => {
// 	if (error) {
// 		console.log(error);
// 	}
// 	console.log("Lectura correcta");
// });
// console.log(alumnoFS);

// const { readFileSync } = require("node:fs");
// const alumnoFS2 = readFileSync(alumnosFile, "utf-8", (error) => {
// 	if (error) {
// 		console.log(error);
// 	}
// 	console.log("Lectura correcta");
// });
// console.log(alumnoFS);

const { baseTariff, studentsDB } = require(`./${alumnosFile}`);
const elderDiscountPerYear = 5;
const elderAgeLimit = 65;
const ageLimit = 18;

function CalculateAge(student) {
	const today = new Date();
	const birthDate = new Date(student.birthDate);

	let age = today.getFullYear() - birthDate.getFullYear();
	let month = today.getMonth() - birthDate.getMonth();

	if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	student.age = age;
	return age;
}

function GetByAge(inputAge, operationMode) {
	let selectedStudents = [];

	switch (operationMode) {
		case -1:
			selectedStudents = studentsDB.filter(
				(x) => CalculateAge(x) <= inputAge
			);
			break;
		case 0:
			selectedStudents = studentsDB.filter(
				(x) => CalculateAge(x) == inputAge
			);
			break;
		case 1:
			selectedStudents = studentsDB.filter(
				(x) => CalculateAge(x) >= inputAge
			);
			break;
		default:
			selectedStudents = studentsDB;
			break;
	}

	return selectedStudents;
}

NotifyParents();

function NotifyParents() {
	let minors = GetByAge(ageLimit, -1);
	minors.map((x) => PrintMinorMessage(x));
}

function PrintMinorMessage(student) {
	// Pepa Pi tienes 17 años y te faltan 32 días para cumplir 18 años.
	console.log(
		`${student.name} ${student.lastName} tienes ${
			student.age
		} y te faltan ${CalculateTimeToAgeLimit(
			student
		)} días para cumplir ${ageLimit} años`
	);
}

function CalculateTimeToAgeLimit(student) {
	const ageToBeOverLimit = new Date(student.birthDate);
	ageToBeOverLimit.setFullYear(ageToBeOverLimit.getFullYear() + ageLimit);

	const diffTime = Math.abs(new Date() - ageToBeOverLimit);
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
}

function PrintDiscountMessage(student) {
	// Pau Guerra tienes 66 años, tu descuento es del 10% y el importe de tu matrícula es de 225 €
	console.log(
		`${student.name} ${student.lastName} tienes ${
			student.age
		} años, tu descuento es del ${
			student.discount
		}% y el importe de tu matrícula es de ${CalculateDiscount(student)}`
	);
}

function NotifyDiscounts() {
	let elders = GetByAge(elderAgeLimit, 1);

	SetAges(elders);

	elders.map((x) => CalculateDiscountPercentage(x));
	elders.map((x) => PrintDiscountMessage(x));
}

function SetAges(students) {
	students.forEach((currentStudent) => {
		currentStudent.age = CalculateAge(currentStudent);
	});
}

function CalculateDiscountPercentage(student) {
	let ageDifference = student.age - elderAgeLimit;
	student.discount = elderDiscountPerYear * ageDifference;
}

function CalculateDiscount(student) {
	let priceDiscount = baseTariff * (student.discount / 100);
	return baseTariff - priceDiscount;
}

NotifyDiscounts();

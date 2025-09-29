create database Academia;

use Academia;

create table Localidades
(
	id_localidad int not null auto_increment,
	nombre_localidad varchar(20) not null,
	primary key (id_localidad)
);

create table Alumnos
(
	id_alumno int not null auto_increment,
	nombre_alumno varchar(20) not null,
	apellido_alumno varchar(20) not null,
	fecha_nacimiento date not null,
	nif_nie varchar(10),
	id_localidad int not null,
	primary key (id_alumno),
	index par_ind (id_localidad),
	foreign key (id_localidad) references Localidades(id_localidad)
	on delete cascade
);

create table Profesores
(
	id_profesor int not null auto_increment,
	nombre_profesor varchar(20) not null,
	apellido_profesor varchar(20) not null,
	fecha_nacimiento date not null,
	nif_nie varchar(10),
	id_localidad int not null,
	primary key (id_profesor),
	index par_ind (id_localidad),
	foreign key (id_localidad) references Localidades(id_localidad)
	on delete cascade
);

create table Cursos
(
	id_curso int not null auto_increment,
	nombre_curso varchar(20) not null,
	primary key (id_curso)
);

create table Asignaturas
(
	id_asignatura int not null auto_increment,
	nombre_asignatura varchar(20) not null,
	id_curso int not null,
	primary key (id_asignatura),
	index par_ind (id_curso),
	foreign key (id_curso) references Cursos(id_curso)
	on delete cascade
);

create table AsignaturasAlumnos
(
	id int not null auto_increment,
	id_alumno int not null,
	id_asignatura int not null,
	anio_matricula date not null,
	primary key (id),
	index FK_AsignaturasAlumnos_Alumno (id_alumno),
	index FK_AsignaturasAlumnos_Asignatura (id_asignatura),
	foreign key (id_alumno) references Alumnos(id_alumno),
	foreign key (id_asignatura) references Asignaturas(id_asignatura)
);

create table AsignaturasProfesores
(
	id int not null auto_increment,
	id_profesor int not null,
	id_asignatura int not null,
	anio_impartido date not null,
	primary key (id),
	index FK_AsignaturasProfesores_Profesor (id_profesor),
	index FK_AsignaturasProfesores_Asignatura (id_asignatura),
	foreign key (id_profesor) references Profesores(id_profesor),
	foreign key (id_asignatura) references Asignaturas(id_asignatura)
);
-- EVALUACION PRACTICA

-- ALUMNO : Santiago Topham
-- FECHA : 26-09-2025

/*
Los ejercicios se organizan en dos bloques, segun su dificultad.
Hay por tanto dos niveles de puntuacion: 0.50 y 1.00 puntos.
La resolucion de cada ejercicio se valora siguiendo este criterio:

* Ejercicio perfectamente resuelto o con algun error no relevante: 100%.
* Ejercicio bien planteado pero no resuelto, con algun error importante 
o varios errores leves, pero que no afecten a la comprension global del tema: 50%.
* Ejercicio no resuelto o con errores graves, que muestren falta de comprension
del tema : 0%.

Por tanto:

* un ejercicio bien resuelto del bloque 1 valdra : 0.50 x 100% = 0.50 puntos
* un ejercicio con algun error importante del bloque 2 valdra : 1.00 x 50% = 0.50 puntos

NOTA IMPORTANTE #1: No debes 'hardcodear' los ids, es decir, introducirlos a mano después de mirar las tablas. 
Si los necesitas, han de ser el resultado de alguna consulta.

NOTA IMPORTANTE #2 : Los "personajes" son las personas que aparecen en la tabla people.
Los actores o actrices son las personas que tienen profesion = 2 (actuacion).

NOTA IMPORTANTE #3 : Debe entregarse solo este fichero sin la base de datos y sin comprimir,
de este modo :  UF_1845_AP_TuNombre_TuAPellido.sql

*/

use cine;

/*
EJERCICIO #1 : 0.50 puntos
Crea una tabla llamada 'genero'.
Debe tener una columna llamada 'id' de tipo entero, que sea la clave primaria y autoincremental.
Debe tener otra columna llamada 'genero' de tipo varchar(10) que no puede ser nula.
*/

drop table if exists genero;

create table genero
(
	id int(2) not null auto_increment,
	genero varchar(15) not null, -- se hace de 15 para poder hacer los siguientes inserts
	primary key (id)
);

/*
EJERCICIO #2 : 0.50 puntos
Introduce en la columna genero de la tabla genero los siguientes datos:
1. 'mujer'
2. 'hombre'
3. 'otro'
4. 'no especificado'
*/

insert into genero
(genero)
values
('mujer'),
('hombre'),
('otro'),
('no especificado');


/*
EJERCICIO #3 : 0.50 puntos
Crea una constraint entre la tabla 'people' y la tabla 'genero'.
La constraint se llamará 'fk_genero' y será de tipo foranea.
La columna de la tabla 'personajes' que se relaciona con la tabla 'genero' es 'genero'.
La columna de la tabla 'genero' que se relaciona con la tabla 'personajes' es 'id'.
En caso de borrado en cascada de la tabla 'genero', se no borrarán los personajes que tengan ese género. 
La relación es de uno a muchos, es decir, un género puede tener varios personajes, pero un personaje solo puede tener un género.
*/

alter table people add constraint fk_genero foreign key (genero) references genero(id) on delete cascade;

/*
EJERCICIO #4 : 0.50 puntos
Muestra solo las actrices.
Ha de aparecer apellido, nombre, fecha_nacimiento
Ordenadas por apellido y nombre, descendente 
*/


select nombre, apellido, fecha_nacimiento
from people p
where p.profesion = (select id_profesion from profesion where profesion = 'actuacion')
and p.genero = (select id from genero where genero = 'mujer')
order by p.apellido, p.nombre desc;

/*
EJERCICIO #5 : 0.50 puntos
Muestra solo los personajes nacidos en el siglo XIX (piensa entre qué años).
Debe aparecer : nombre y apellido juntos como 'personajes nacidos en el siglo XIX'
ordenados por profesión y nombre ascendente.
*/

select concat(p.nombre, ' ', p.apellido) as 'personajes nacidos en el siglo XIX'
from people p
where p.fecha_nacimiento between '1800' and '1899'
order by p.profesion, 1 asc;

/*
EJERCICIO #6 : 0.50 puntos
Muestra solo la información del personaje dedicado a la música con la 
fecha de nacimiento más reciente. Todos los datos, excepto el id.
*/

select p.nombre, p.apellido, p.profesion, p.genero, p.oscars, p.fecha_nacimiento
from people p
where p.profesion = (select id_profesion from profesion where profesion = 'musica')
and p.fecha_nacimiento = (select max(p.fecha_nacimiento)
							from people p
							where p.profesion = (select id_profesion from profesion where profesion = 'musica'))		
order by p.fecha_nacimiento desc;




/*
EJERCICIO #7 : 0.50 puntos
Personas dedicadas a la interpretación de cualquier género (actores, actrices) 
que únicamente han ganado un Óscar.
Ha de aparecer el nombre y el apellido combinados como 'actores que solo han ganado un oscar' y el género
Ordenados por apellido en forma ascendente.
*/

select concat(p.nombre, ' ', p.apellido) as 'actores que solo han ganado un oscar', g.genero
from people p
join genero g on p.genero = g.id
where p.profesion = (select id_profesion from profesion where profesion = 'actuacion')
and p.oscars = 1
order by p.apellido asc;

/*
EJERCICIO #8 : 0.50 puntos
Muestra cuántos personajes (actores, directores, etc) no han ganado nunca un Óscar. 
Debe aparecer solo la cantidad de personajes.
*/

select count(*)
from people p
where p.oscars = 0;

/*
EJERCICIO #9 : 0.50 puntos
Borra de la lista el personaje:  "Arthur Rubinstein"
*/

delete p
-- select *
from people p
where p.nombre = 'Arthur'
and p.apellido = 'Rubinstein';


/*
EJERCICIO #10 : 0.50 puntos
La fecha de nacimiento de "John Williams" está mal, ya que debe ser 1932. Cámbiala.
*/

update people
set fecha_nacimiento = 1932
where nombre = 'John'
and apellido = 'Williams';

/*
EJERCICIO #11 : 0.50 puntos
Muestra que director que no ha ganado ningún Óscar es el que tiene la fecha de nacimiento más antigua.
Debe aparecer el nombre completo del director y su profesión
*/

select p.nombre, p.apellido, r.profesion
from people p
join profesion r on p.profesion = r.id_profesion
where r.profesion = 'direccion'
and p.oscars = 0
and p.fecha_nacimiento = (select min(p.fecha_nacimiento) 
						from people p
						join profesion r on p.profesion = r.id_profesion
						where r.profesion = 'direccion'
						and p.oscars = 0)	
order by fecha_nacimiento asc;

/*
EJERCICIO #12 : 0.50 puntos
Muestra sólo las personas dedicadas a la interpretación de género masculino nacidas entre 1920 y 1940
Ha de aparecer : nombre, apellido, profesión y la fecha de nacimiento como 'nacimiento'
Ordenado por la fecha de nacimiento en forma descendente.
*/

select p.nombre, p.apellido, r.profesion, p.fecha_nacimiento as nacimiento
from people p
join profesion r on p.profesion = r.id_profesion
where r.profesion = 'actuacion'
and p.genero = (select id from genero where genero = 'hombre')
and p.fecha_nacimiento between '1920' and '1940'
order by p.fecha_nacimiento desc;

/*
EJERCICIO #13 : 1.00 puntos
Muestra los personajes que han ganado más Óscars, pero sólo los que están en primera posición.
Debe aparecer nombre, apellido y profesión
Ordenados por apellido descendente
*/

select p.nombre, p.apellido, r.profesion
from people p
join profesion r on p.profesion = r.id_profesion
where p.oscars = (select max(p2.oscars) from people p2)
order by 2 desc;

/*
EJERCICIO #14 : 1.00 puntos
¿Cuántos personajes hay de cada género?
La respuesta debe ser : 'Hay X mujeres, Y hombres y Z otros' como 'Genero de los personajes'
*/

select concat('Hay ', count(*), ' ', g.genero) as 'Genero de los personajes'
from people p
join genero g on p.genero = g.id
group by g.genero;

/*
EJERCICIO #15 : 1.00 puntos
Crea un procedimiento almacenado para añadir personajes a la base de datos.
Se llamará st_poblar_bd 
Los parámetros serán : nombre, apellido, profesion, genero, oscars y fecha de nacimiento

Pruébalo con estos ejemplos:
st_poblar_bd('Groucho', 'Marx', 'actuacion', 'hombre', 1, 1980);
st_poblar_bd('Howard', 'Shore', 'musica', 'hombre', 1, 1946);

*/
drop procedure if exists st_poblar_bd;
DELIMITER $$
use cine $$
create procedure st_poblar_bd(
	name varchar(20),
	lastName varchar(30),
	job varchar(25),
	gender varchar(15),
	awards int(2),
	birthDate varchar(4)
)
begin
	declare jobId int;
    declare genderId int;

	select p.id_profesion
	into jobId
	from profesion p
	where p.profesion = job;
	
	select g.id
	into genderId
	from genero g
	where g.genero = gender;
	
	if
		jobId is null or genderId is null
    then
		select "error en el nombre de la profesion o del genero" as "error";
    else
		insert into people
		(nombre, apellido, profesion, genero, oscars, fecha_nacimiento)
		values
		(name, lastName, jobId, genderId, awards, birthDate);
	end if;
end $$
DELIMITER ;


call st_poblar_bd('Groucho', 'Marx', 'actuacion', 'hombre', 1, 1980);

call st_poblar_bd('Howard', 'Shore', 'musica', 'hombre', 1, 1946);

select * from people;






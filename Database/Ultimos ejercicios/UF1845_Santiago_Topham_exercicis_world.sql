-- Más ejercicios sobre la base de datos "World"

-- ALUMNO : (pon aquí tu nombre)
-- FECHA : 29-09-2025

/*
Los ejercicios se organizan en tres bloques, segun su dificultad.
Hay por tanto tres niveles de puntuacion: 0.50, 1.00 y 1.50 puntos.
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

NOTA IMPORTANTE #2 : Debe entregarse solo este fichero sin la base de datos y sin comprimir,
de este modo :  UF_1845_AP_Tu_Nombre.sql

*/


-- 1 Mostrar todos los países de la tabla "country". (0.50 puntos)
select c.*
from country c;


-- 2 Mostrar los nombres y poblaciones de todas las ciudades de la tabla "city". (0.50 puntos)
select c.Name, c.Population
from city c;

-- 3 Mostrar los nombres de los países en orden alfabético. (0.50 puntos)
select c.Name
from country c
order by c.Name asc;

-- 4 Mostrar las ciudades con una población superior a 1 millón de habitantes. (0.50 puntos)
select *
from city c
where c.Population > 1000000;

-- 5 Mostrar el país con la población más alta. (0.50 puntos)
select *
from country c
where c.Population = (select max(c2.Population) from country c2);

-- 6 Mostrar los nombres de los países que tengan una población superior a 100 millones de habitantes. (0.50 puntos)
select c.Name
from country c
where c.Population > 100000000;

-- 7 Mostrar los nombres de las ciudades que pertenezcan al país con el código 'ESP' (España). (0.50 puntos)
select c.Name
from city c
where c.CountryCode = 'ESP';

-- 8 Mostrar los nombres de los países que tengan una población entre 50 y 100 millones de habitantes. (0.50 puntos) (0.50 puntos)
select *
from country c
where c.Population  between 50 and 100000000; -- 50000000

-- 9 Mostrar el nombre y la población de las ciudades que empiecen por la letra 'A'. (0.50 puntos)
select c.Name, c.Population
from city c
where c.Name like 'A%';

-- 10 Mostrar los nombres de los países cuya capital tenga más de 5 millones de habitantes. (0.50 puntos)
select co.Name
from country co
join city ci on co.Capital  = ci.ID
where ci.Population > 5000000;

-- 11 Mostrar el nombre y la población de las ciudades que sean capitales. (1.00 puntos)
select c.Name, c.Population
from city c
where c.ID in (select distinct co.Capital from Country co);

-- 12 Mostrar el nombre de los países cuyas capitales tengan una población superior a 10 millones de habitantes. (1.00 puntos)
select co.Name
from country co
join city ci on co.Capital  = ci.ID
where ci.Population > 10000000;

-- 13 Mostrar los nombres de las ciudades y sus respectivas poblaciones ordenadas de mayor a menor población. (1.00 puntos) 
select c.Name, c.Population
from city c
order by c.Population desc

-- 14 Crea un procedimiento almacenado llamado "ObtenerCiudadesPorPais" que reciba como parámetro el código de un país y muestre el nombre y la población de todas las ciudades pertenecientes a ese país.  (2.00 puntos)
drop procedure if exists sp_ObtenerCiudadesPorPais;
DELIMITER $$
use world $$
create procedure sp_ObtenerCiudadesPorPais(
	countryCode varchar(20)
)
begin
	select c.Name, c.Population
	from city c
	where c.CountryCode = countryCode;
end $$
DELIMITER ;


call sp_ObtenerCiudadesPorPais('URY');

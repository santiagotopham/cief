-- Utiliza la base de datos sakila, disponible en MySQL Workbench,
-- para resolver estos ejercicios 

use sakila;

-- 1) Actores que tienen el primer nombre "Gary"
select *
from actor a
where a.first_name = 'Gary';

-- 2) Actores que tiene de primer apellido "Streep"
select *
from actor a
where a.last_name = 'Streep';

-- 3) Actores que contengan una "o" en su nombre
select *
from actor a
where a.first_name like '%o%';

-- 4) Actores que contengan una "a" en su nombre y una "e" en su apellido
select *
from actor a
where a.first_name like '%a%'
and a.last_name like '%e%';

-- 5) Actores que contengan dos "o" en su nombre (en cualquier posicion) y una "a" en su apellido
select *
from actor a
where a.first_name like '%o%o%'
and a.last_name like '%a%';

-- 6) Actores cuya tercera letra del nombre sea "b"
select *
from actor a
where SUBSTRING(a.first_name, 3,1) = 'b';

-- 7) Ciudades que empiezan por "a"
select *
from city c
where c.city like 'a%';

-- 8) Ciudades que acaban por "s"
select *
from city c
where c.city like '%s';

-- 9) Ciudades del country "France"
select c.*
from city c
join country co on c.country_id = co.country_id
where co.country = 'France'; 

-- 10) Ciudades con nombres compuestos (como New York)
select c.*
from city c
where c.city like '% %';

-- 11) películas con una duración entre 80 y 100 m.
select *
from film f
where f.length between 80 and 100;



-- 12) películas con un rental_rate entre 1 y 3
select *
from film f
where f.rental_rate between 1 and 3;


-- 13) películas con un título de más de 11 letras.
select *
from film f
where CHARACTER_LENGTH(f.title) > 11;


-- 14) películas con un rating de PG o G.
select *
from film f
where f.rating = 'PG'
or f.rating = 'G';

 
-- 15) ¿Cuantas ciudades tiene el country ‘France’? 
select count(*)
from city c
join country co on c.country_id = co.country_id
where co.country = 'France'; 


-- 16) Películas que no tengan un rating de NC-17
select *
from film f
where f.rating != 'NC-17';


-- 17) Películas con un rating PG y duración de más de 120.
select *
from film f
where f.rating = 'PG'
and f.length > 120;


-- 18) ¿Cuantos actores hay?
select count(*)
from actor a;


-- 19) Película con mayor duración.
select *
from film f
order by length desc 
limit 1;


-- 20) ¿Cuantos clientes viven en Indonesia?
select count(*)
from customer c
join address a on c.address_id = a.address_id
join city ci on a.city_id = ci.city_id
join country co on ci.country_id = co.country_id
where co.country = 'Indonesia';


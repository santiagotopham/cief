-- Más ejercicios con la base de datos Sakila
-- ALUMNO : (pon aquí tu nombre)
-- FECHA : 29-09-2025

-- 21) Visualiza los 10 actores que han participado en más películas
-- (de mas a menos participaciones)

select a2.first_name, a2.last_name, movies.Cant_peliculas
from actor a2
join (
	select a.actor_id, count(*) as "Cant_peliculas"
	from actor a
	join film_actor fa on a.actor_id = fa.actor_id
	group by a.actor_id
	) as movies
	on a2.actor_id  = movies.actor_id
order by 3 desc
limit 10;


-- 22) Visualiza los clientes de países que empiezan por S
select distinct c.*
from customer c 
join address a on c.address_id  = a.address_id
join city ci on a.city_id  = ci.city_id
join country co on ci.country_id  = co.country_id
where co.country like 'S%';


-- 23) Visualiza el top-10 de países con más clientes
select co.country, count(*) as "Cant clientes"
from customer c 
join address a on c.address_id  = a.address_id
join city ci on a.city_id  = ci.city_id
join country co on ci.country_id  = co.country_id
group by co.country
order by 2 desc
limit 10;

-- 24) Saca las 10 primeras películas alfabéticamente y el número de copias que se disponen de cada una de ellas
select f.title, count(*) as "Num copias"
from film f
join inventory i on f.film_id = i.film_id
group by f.title
order by f.title
limit 10;

-- 25 ¿ Cuántas películas ha alquilado Deborah Walker?
select count(*)
from customer c
join rental r on c.customer_id  = r.customer_id
where c.first_name = 'Deborah'
and c.last_name  = 'Walker';

-- 26) Crea un procedimiento almacenado llamado 'rentals_by_client'
-- el cual, a partir del nombre y apellido del cliente,
-- muestre : nombre del cliente, apellido del cliente, título de la película, fecha de alquiler
-- ordenado por fecha de alquiler descendente
-- Pruébalo con el cliente 'Deborah Walker'
drop procedure if exists sp_rentals_by_client;
DELIMITER $$
use sakila $$
create procedure sp_rentals_by_client(
	firstName varchar(30),
	lastName varchar(30)
)
begin
	select c.first_name, c.last_name, f.title, r.rental_date
	from customer c
	join rental r on c.customer_id  = r.customer_id
	join inventory i on r.inventory_id = i.inventory_id
	join film f on i.film_id = f.film_id
	where c.first_name = firstName
	and c.last_name  = lastName
	order by r.rental_date desc;
end $$
DELIMITER ;


call sp_rentals_by_client('Deborah', 'Walker');


-- 27) Crea un procedimiento almacenado llamado 'client_rental' que, realizando el alquiler de
-- una pelicula por parte de un cliente, nos retorne cuantos alquileres ha hecho.
-- la fecha del alquiler es la actual
-- Pruébalo así : call client_rental('Deborah', 'Walker', "ALADDIN CALENDAR" )
drop procedure if exists client_rental;
DELIMITER $$
use sakila $$
create procedure client_rental(
    firstName varchar(45),
    lastName varchar(45),
    filmName varchar(255)
)
begin
    declare customerId int;
    declare inventoryId int;
    declare rentalsCount int;

    select customer_id
    into customerId
    from customer
    where first_name = firstName
      and last_name = lastName
    limit 1;

    select i.inventory_id
    into inventoryId
    from inventory i
    inner join film f on f.film_id = i.film_id
    where f.title = filmName
    limit 1;

    insert into rental(rental_date, inventory_id, customer_id, staff_id)
    values (now(), inventoryId, customerId, 1); 
    select count(*) AS total_rentals
    from rental
    where customer_id = customerId;

end$$
DELIMITER ;


call client_rental('Deborah', 'Walker', "ALADDIN CALENDAR")
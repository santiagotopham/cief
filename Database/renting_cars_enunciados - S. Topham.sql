
-- Por si te hace falta
# Quitar temporalmente la restricción de consultas y evitar error 1055
# SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));

-- max(), min(), count(), sum(), avg()

use renting_cars;

-- 1. ¿Cuál es el modelo (o modelos) más caro y su precio? ¿Y los más baratos?
-- 1a. El más caro
select m.marca, m.nombre_modelo, v.precio_dia
from vehiculos v
join modelos m on v.id_modelo = m.id_modelo
-- group by v.precio_dia
where v.precio_dia = (select max(v.precio_dia)
					from vehiculos v);
                    
-- 1b. El más barato
select m.marca, m.nombre_modelo, v.precio_dia
from vehiculos v
join modelos m on v.id_modelo = m.id_modelo
-- group by v.precio_dia
where v.precio_dia = (select min(v.precio_dia)
					from vehiculos v);
                    

-- 2. Según la fecha de recogida del primer alquiler 
-- ¿quien fue el primer cliente de la empresa?
-- nombre, apellido, tipo, fecha
select c.nombre_cliente, c.apellido_cliente, a.fecha_recogida
from alquileres a
join clientes c on a.id_cliente = c.id_cliente
order by a.fecha_recogida asc
limit 1;

-- 3. ¿De qué concesionarios se han realizado más de 2 alquileres?
select c.id_concesionario, c.nombre_concesionario, count(*) as alquileres
from alquileres a
join vehiculos v on a.id_vehiculo = v.id_vehiculo
join concesionarios c on v.id_concesionario = c.id_concesionario 
group by c.id_concesionario
having count(*) > 2;


-- 4. Facturación total de 2023 por clientes
-- Nota: se cobra en el momento de la devolución
select sum(v.precio_dia * d.dias_alquilados) as facturacion_total
from alquileres a
join vehiculos v on a.id_vehiculo = v.id_vehiculo
join (select id_alquiler, DATEDIFF(a.fecha_devolucion, a.fecha_recogida) as dias_alquilados
	from alquileres a
	group by id_alquiler)
    as d
    on a.id_alquiler = d.id_alquiler
where YEAR(a.fecha_devolucion) = 2023;


-- 5. Promedio de los precios/dia de los coches de cada concesionario
-- Mostrar nombre de concesionario y promedio
select s.id_concesionario, s.nombre_concesionario, round(avg(v.precio_dia), 2) as promedio
from vehiculos v
join concesionarios s on v.id_concesionario = s.id_concesionario
group by s.id_concesionario;


-- 6. Tenemos un nuevo cliente, con estos datos:
--  Steve Ballmer, dni y carnet 666666666, email steve@ballmer.com, teléfono 666666666, vive en Roma, password 1234
-- Hay que obtener el id del pais mediante un select, no ponerlo directamente
INSERT INTO clientes
(nombre_cliente,
apellido_cliente,
dni_conductor,
carnet_conducir,
email_cliente,
telefono,
poblacion_residencia,
id_pais,
password_cliente,
tipo_cliente)
VALUES
(
    "Steve",
    "Ballmer",
    "666666666",
    "666666666",
    "steve@ballmer.com",
    "666666666",
    "Roma",
    (select p.id_pais from paises p where p.nombre_pais = 'Italia'),
    "1234",
    "particular"
);


-- 7. ¿Qué clientes no han alquilado nunca un vehículo?
select *
from clientes c
where c.id_cliente not in (select id_cliente from alquileres);

-- 8. Crea una vista llamada vista_clientes que muestre:
-- id_cliente, nombre_cliente, apellido_cliente, email_cliente, telefono, poblacion_residencia, nombre_pais
-- Muestra los datos de la vista
drop view if exists vista_clientes;
create view vista_clientes as
select c.id_cliente, c.nombre_cliente, c.apellido_cliente, c.email_cliente, c.telefono, c.poblacion_residencia, p.nombre_pais
from clientes c
join paises p on c.id_pais = p.id_pais;

select * from vista_clientes;

-- 9. Crea una vista llamada vista_alquileres que muestre:
-- id_alquiler, fecha_recogida, fecha_devolucion, nombre_cliente, apellido_cliente, nombre_concesionario, nombre_modelo, marca, matricula
-- Muestra los datos de la vista
drop view if exists vista_alquileres;
create view vista_alquileres as
select a.id_alquiler, a.fecha_recogida, a.fecha_devolucion, cl.nombre_cliente, cl.apellido_cliente, c.nombre_concesionario, m.nombre_modelo, m.marca, v.matricula
from alquileres a
join vehiculos v on a.id_vehiculo = v.id_vehiculo
join modelos m on v.id_modelo = m.id_modelo
join concesionarios c on v.id_concesionario = c.id_concesionario
join clientes cl on a.id_cliente = cl.id_cliente;

select * from vista_alquileres;

-- 10. ¿Qué clientes han alquilado más de 2 veces?
select c.id_cliente, c.nombre_cliente, c.apellido_cliente, count(*)
from alquileres a
join clientes c on a.id_cliente = c.id_cliente
group by c.id_cliente
having count(*) > 2;

-- 11. Crea un procedimiento almacenado que reciba el id_cliente y devuelva el número de alquileres que ha realizado
drop procedure if exists sp_alquileres_por_cliente;
DELIMITER $$
use renting_cars $$
create procedure sp_alquileres_por_cliente(idCliente int)
begin
	select count(*) as alquileres
    from alquileres a
	join clientes c on a.id_cliente = c.id_cliente
    where c.id_cliente = idCliente;
end $$
DELIMITER ;

call sp_alquileres_por_cliente(1);

-- 12. Crea un procedimiento almacenado que reciba el id_concesionario y devuelva el número de vehículos que tiene
drop procedure if exists sp_vehiculos_por_concesionario;
DELIMITER $$
use renting_cars $$
create procedure sp_vehiculos_por_concesionario(idConcesionario int)
begin
	select count(v.id_vehiculo)
    from concesionarios c
	join vehiculos v on c.id_concesionario = v.id_concesionario
    where c.id_concesionario = idConcesionario;
end $$
DELIMITER ;

call sp_vehiculos_por_concesionario(1);

-- 13. Crea un procedimiento almacenado que reciba el id_cliente y devuelva la facturación total que ha generado
drop procedure if exists sp_facturacion_por_cliente;
DELIMITER $$
use renting_cars $$
create procedure sp_facturacion_por_cliente(idCliente int)
begin
	select c.id_cliente, sum(v.precio_dia * d.dias_alquilados) as facturacion_total
	from clientes c
	join alquileres a on c.id_cliente = a.id_cliente
	join (select id_alquiler, DATEDIFF(a.fecha_devolucion, a.fecha_recogida) as dias_alquilados
		from alquileres a
		group by id_alquiler)
		as d
		on a.id_alquiler = d.id_alquiler
	join vehiculos v on a.id_vehiculo = v.id_vehiculo
	where a.fecha_devolucion is not null
	and c.id_Cliente = idCliente
	group by c.id_cliente;
end $$
DELIMITER ;

call sp_facturacion_por_cliente(1);

-- 14. Crea una función que reciba el id_cliente y devuelva el número de vehículos que ha alquilado
drop function if exists fn_vehiculos_por_cliente;

delimiter $$
use renting_cars $$
create function fn_vehiculos_por_cliente(idCliente int)
returns int deterministic
begin

set @cant_vehiculos = (
	select count(distinct v.id_vehiculo)
	from alquileres a
	join clientes c on a.id_cliente = c.id_cliente
	join vehiculos v on a.id_vehiculo = v.id_vehiculo
	where c.id_cliente = idCliente);
    
    return @cant_vehiculos;

end $$
delimiter ;

select fn_vehiculos_por_cliente(1);

-- 15. Crea una función que reciba el id_concesionario y devuelva la facturación total que ha generado
drop function if exists fn_facturacion_por_concesionario;

delimiter $$
use renting_cars $$
create function fn_facturacion_por_concesionario(idConcesionario int)
returns int deterministic
begin

	set @facturacion = (
		select sum(v.precio_dia * d.dias_alquilados) as facturacion_total
		from concesionarios c
		join vehiculos v on c.id_concesionario = v.id_concesionario
		join alquileres a on a.id_vehiculo = v.id_vehiculo
		join (select id_alquiler, DATEDIFF(a.fecha_devolucion, a.fecha_recogida) as dias_alquilados
			from alquileres a
			where a.fecha_devolucion is not null
			group by id_alquiler)
			as d
		on a.id_alquiler = d.id_alquiler
		where c.id_concesionario = idConcesionario);
    
    return @facturacion;

end $$
delimiter ;

select fn_facturacion_por_concesionario(1);



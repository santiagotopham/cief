-- Crear vistas
create view vw_clientes as
select * from clientes

-- select * from vw_clientes 

-- Como hacer un procedimiento almacenado
DELIMITER //
create procedure sp_saludo ()
	comment "saludo sencillo"
    begin
		select "hola mundo";
    end //
DELIMITER ;

call sp_saludo();

use clientes3;
drop procedure if exists saludo2;

DELIMITER $$
use clientes3$$
create procedure saludo2 (in nombre varchar(20))
begin
	select concat ("hola ", nombre, "!");
end $$
DELIMITER ;

call saludo2("tecno");


-- vamos a añadir una columna a la tabla productos que se llame stock y va a tener un valor por defecto de 5 unidades
alter table productos
add column stock int default 5 not null;

describe productos;

drop procedure if exists sp_compra;

DELIMITER $$
use clientes3 $$
CREATE PROCEDURE sp_compra(nombreCliente varchar(30), apellidoCliente varchar(60), nombreProducto varchar(30), cantidad int)
comment "compra v2"
begin
	declare idCliente int;
    declare idProducto int;
    
    select c.id_cliente
    into idCliente
	from clientes c
	where c.nombre_cliente = nombreCliente
	and c.apellido_cliente = apellidoCliente;
    
    select p.id_producto
    into idProducto
	from productos p
	where p.nombre_producto = nombreProducto;
    
    if
		idCliente is null or idProducto is null
    then
		select "error en el nombre del cliente o del producto" as "error";
    else
		insert into clientes_productos(id_cliente, id_producto, cantidad)
		values
		(idCliente, idProducto, cantidad);
	end if;
end $$
DELIMITER ;


call sp_compra("test", "Kent", "Xiaomi 28", 2);

select c.nombre_cliente, p.nombre_producto, cp.cantidad
from clientes_productos cp
join clientes c on cp.id_cliente = c.id_cliente
join productos p on cp.id_producto = p.id_producto;

-- crear un procedimiento para crear un cliente
-- indicaremos
-- 1) nombre
-- 2) apellido
-- 3) edad
-- 4) poblacion (si no existe, la creamos)
-- 5) pais (si no existe, lo creamos)

DELIMITER $$
use clientes3 $$
create procedure sp_add_client(
nombreCliente varchar(30),
apellidoCliente varchar(60),
edad int,
nombreCiudad varchar(100),
nombrePais varchar(50))
begin
	declare idCiudad int;
    declare idPais int;

	select c.id_ciudad
    into idCiudad
    from ciudades c
    where c.nombre_ciudad = nombreCiudad;
    
    select id_pais
    into idPais
    from paises p
    where p.nombre_pais = nombrePais;
    
    if
		idPais is null
    then
		insert into paises(nombre_pais)
		values
		(nombrePais);
        select id_pais
        into idPais
        from paises p
        where p.nombre_pais = nombrePais;
	end if;
    
    if
		idCiudad is null
    then
		insert into ciudades(nombre_ciudad, id_pais)
		values
		(nombreCiudad, idPais);
        select id_ciudad
        into idCiudad
        from ciudades c
        where c.nombre_ciudad = nombreCiudad;
	end if;
    
    insert into clientes(nombre_cliente, apellido_cliente, edad, id_ciudad)
	values
	(nombreCliente, apellidoCliente, edad, idCiudad);

end $$
DELIMITER ;

call sp_add_client("test", "test2", 19, "testC", "testP");


drop function if exists num_compras;

delimiter $$
use clientes3 $$
create function num_compras(id_cliente int)
returns int deterministic
begin

set @num_compra = (
	select count(id_cliente)
	from clientes_productos cp
	where cp.id_cliente = id_cliente
	group by cp.id_cliente);
    
    return @num_compra;

end $$
delimiter ;



select *, num_compras(id_cliente) as compras
from clientes c;



drop trigger if exists actualiza_stock;

delimiter $$
create trigger actualiza_stock
-- before / after
after insert on clientes_productos
for each row
begin
	update productos
    set stock = stock - new.cantidad
    where id_producto = new.id_producto;
end $$
delimiter ;

insert into clientes_productos(id_cliente, id_producto, cantidad)
values
();



-- mostrar usuarios del sistema
SELECT * FROM mysql.USER;

-- crear usuario
create user 'world_user'@'localhost' identified by '123456'

-- dar permisos
grant select on world.* to 'world_user'@'localhost';
grant insert on world.* to 'world_user'@'localhost';
grant update, delete on world.* to 'world_user'@'localhost';

revoke all on world.* from 'world_user'@'localhost';

show databases;

show grants for 'world_user'@'localhost';
show grants for 'root'@'localhost';

revoke select on world.* from 'world_user'@'localhost';


-- LO QUE NO HAY QUE HACER
create user 'root2'@'%' identified by 'root2';
grant all privileges on *.* to 'root2'@'%' with grant option;
revoke all privileges on *.* from 'root2'@'%';
drop user 'root2'@'%';
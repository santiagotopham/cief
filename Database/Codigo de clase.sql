-- instrucciones para crear una base de datos
CREATE SCHEMA if not EXISTS clientes3;
CREATE DATABASE IF NOT EXISTS clientes3;

-- Usar una base de datos en concreto
-- Hay que ejecutar esta instrucción al principio
-- de cada conexión
USE clientes3;

/*
Necesitamos una tabla llamada productos
con estos campos, todos obligatorios:
id_producto autoincremental primary key
nombre_producto varchar 30
precio_producto decimal(10, 2)
*/

CREATE table productos (
id_producto int auto_increment not null primary key,
nombre_producto varchar(30) not null,
precio_producto decimal(10, 2) not null
);

insert into productos(nombre_producto, precio_producto) VALUES
("Iphone 16", 750.25);

alter table productos
add column referencia varchar(10) null;

update productos -- actualizar tabla productos
set referencia = "12345" -- asignar el valor
where nombre_producto = "Iphone 16"; -- indicar el registro a actualizar

/*
Añadir una columna llamada color de tipo varchar 25
Actualiza la columna con un color (el que quieras)
*/
alter table productos
add column color varchar(10) null;


-- cambiar el nombre a la columna
alter table productos
rename column color to colour;

-- borrar la columna colour
alter table productos
drop column colour;

insert into productos(nombre_producto, precio_producto) VALUES
("Samsung 50", 800.35),
("Xiaomi 28", 140.89),
("Redmi 14", 200.67),
("Realme 10", 281.60),
("Samsung 52", 900.45)
;


-- count(*) para contar filas
-- Ejemplo: contar todas las filas de la tabla
SELECT count(*) -- contar las filas
as "cantidad de registros" -- ponemos un alias al resultado
FROM productos; -- indicamos la tabla

-- Mostrar cuantos productos son de Samsung
-- con el encabezado "productos de Samsung"
SELECT count(*) -- contar las filas
as "productos de Samsung" -- ponemos un alias al resultado
FROM productos -- indicamos la tabla
WHERE nombre_producto LIKE "Samsung%";

-- Mostrar cuantos productos valen más de 500
-- con el encabezado "precio > 500"
SELECT count(*) -- contar las filas
as "precio > 500" -- ponemos un alias al resultado
FROM productos -- indicamos la tabla
WHERE precio_producto > 500;

-- Mostrar qué productos valen más de 500
SELECT nombre_producto as "Producto"
FROM productos
WHERE precio_producto > 500;


SELECT sum(precio_producto)
as "suma de los precios"
FROM productos;

-- Mostrar el promedio de los productos < 300
SELECT round(avg(precio_producto), 2) as promedio
FROM productos
WHERE precio_producto < 300;

-- max(precio_producto)
-- Mostrar el precio del producto más caro
-- con el encabezado "precio más caro" 
SELECT max(precio_producto)
as "precio más caro"
FROM productos;

-- Mostrar el precio del Samsung más caro
SELECT max(precio_producto)
as "precio más caro"
FROM productos
where nombre_producto like "samsung%"
;

-- min() valor mínimo

SELECT *
FROM productos
ORDER BY nombre_producto ASC;

SELECT *
FROM productos
ORDER BY nombre_producto DESC;

-- Mostrar los productos ordenados 
-- por precio del más caro al más barato
SELECT *
FROM productos
ORDER BY precio_producto DESC;

SELECT *
FROM productos
ORDER BY precio_producto DESC
LIMIT 2
;

-- Insertar dos productos:
-- uno con el precio más caro
-- otro con el segundo precio más caro
-- Kindle 
-- Kobo

INSERT INTO productos(nombre_producto, precio_producto) VALUES
("Kindle", 900.45), ("Kobo", 800.35);

select *
from productos
order by precio_producto desc, nombre_producto asc
;

-- Si queremos saber el o los productos más caros
-- esta consulta NO SIRVE:
select *
from productos
order by precio_producto desc
limit 1; 

-- ¿Cúal es precio más alto?
SELECT max(precio_producto)
from productos;

SELECT *
FROM productos
WHERE precio_producto = (SELECT max(precio_producto) from productos);

-- ¿Qué productos valen menos de 900 y más de 200?
-- ordénalos de mayor a menor precio
SELECT *
FROM productos
where precio_producto < 900 and precio_producto > 200
order by precio_producto desc;

-- Mostrar qué producto/s NO llevan la letra e en el nombre
SELECT *
FROM productos
WHERE nombre_producto NOT LIKE "%e%";

-- Poner textos en mayúsculas
SELECT upper(nombre_producto) FROM productos;
-- Poner textos en minúsculas
SELECT lower(nombre_producto) FROM productos;

-- "nombre: Iphone 16, precio: 750.25"
SELECT concat("nombre: ", nombre_producto, ", precio: ", precio_producto)
as productos
FROM productos;

-- Mostrar qué productos tienen id_producto que sea 3, 4, o 7
SELECT *
FROM productos
WHERE id_producto in (3, 4, 7);

SELECT *
FROM productos
WHERE id_producto = 3 or id_producto = 4 or id_producto = 7;

-- Hay que mostrar los precios de los productos, sin repeticiones
SELECT DISTINCT precio_producto
FROM productos
order by precio_producto;

-- Crear tabla clientes, con estas columnas:
-- id_cliente obligatorio,
-- nombre_cliente obligatorio,
-- apellido_cliente obligatorio,
-- poblacion_cliente obligatorio,
-- pais_cliente obligatorio,
-- edad int obligatorio

CREATE TABLE clientes (
id_cliente int auto_increment not null primary key,
nombre_cliente varchar(40) not null,
apellido_cliente varchar(60) not null,
poblacion_cliente varchar(60) not null,
pais_cliente varchar(50) not null,
edad int unsigned not null
);

insert into clientes(nombre_cliente, apellido_cliente, poblacion_cliente, pais_cliente, edad)
values ("Peter", "Parker", "Nueva York", "USA", 25),
("Clark", "Kent", "Metropolis", "USA", 30), ("Louis", "Lane", "Metropolis", "USA", 28),
("Bill", "Jobs", "Paris", "Francia", 75), ("Steve", "Gates", "Londres", "Reino Unido", 78),
("Elon", "Capone", "Londres", "Reino Unido", 50), ("Al", "Musk", "Londres", "Reino Unido", 78)
;

-- Mostrar el nombre de los clientes de este modo "apellido, nombre" como "nombre cliente"
-- Mostrar el/los clientes de mayor edad
-- Nombres de clientes cuyo apellido contiene la letra a
-- Clientes que viven en Londres ordenados por apellido de forma descendente
-- Promedio de edades de los clientes que viven en USA

-- Clientes cuyo nombre acaba en "l"
-- Clientes cuyo apellido contiene la "k"
-- Clientes entre 30 y 50 años (incluidos)
-- Promedio de edad de los clientes del Reino Unido

-- Nombre del país y cuantos clientes hay en ese país: USA 3
-- En qué país hay menos clientes


SELECT *
FROM productos
WHERE precio_producto > 500;

SELECT pais_cliente as pais, COUNT(pais_cliente) as "numero de clientes"
FROM clientes
GROUP BY pais_cliente
HAVING count(pais_cliente) > 2
;


CREATE TABLE paises (
id_pais int AUTO_INCREMENT not null PRIMARY KEY,
nombre_pais varchar(50) not null UNIQUE
);

/*
INSERT INTO paises(nombre_pais)
VALUES ("USA"), ("Reino Unido"), ("Francia");
*/

-- ¿Qué paises hay en la tabla clientes?
SELECT DISTINCT pais_cliente
FROM clientes;

INSERT INTO paises(nombre_pais)
SELECT DISTINCT pais_cliente
FROM clientes;

CREATE TABLE ciudades(
id_ciudad int AUTO_INCREMENT not null PRIMARY KEY,
nombre_ciudad varchar(100) not null,
id_pais int not null
);

-- Mostrar los nombres de las ciudades sin repeticiones
-- y a que pais corresponden
SELECT DISTINCT poblacion_cliente, pais_cliente
FROM clientes;

INSERT INTO ciudades(nombre_ciudad, pais)
SELECT DISTINCT poblacion_cliente, pais_cliente
FROM clientes;

UPDATE ciudades c, paises p
SET c.id_pais = p.id_pais
WHERE c.pais = p.nombre_pais
;

-- Vincular con el id_ciudad la tabla ciudades y 
-- la tabla clientes
-- paso 1 añadir columna con id_ciudad en tabla clientes
alter table clientes
add column id_ciudad int;

UPDATE clientes cl, ciudades ci
SET cl.id_ciudad = ci.id_ciudad
WHERE cl.poblacion_cliente = ci.nombre_ciudad
;

ALTER TABLE clientes 
DROP COLUMN pais_cliente,
DROP COLUMN poblacion_cliente;

ALTER TABLE ciudades
DROP COLUMN pais;

select *
from clientes;

-- Solución a evitar (aunque funciona)
SELECT cl.nombre_cliente, cl.apellido_cliente, cl.edad, ci.nombre_ciudad
FROM clientes cl, ciudades ci
WHERE cl.id_ciudad = ci.id_ciudad;

-- Solución correcta
SELECT cl.nombre_cliente, cl.apellido_cliente, cl.edad, ci.nombre_ciudad, p.nombre_pais
FROM clientes cl
JOIN ciudades ci
ON cl.id_ciudad = ci.id_ciudad
JOIN paises p
ON ci.id_pais = p.id_pais
;

SELECT cl.nombre_cliente, cl.apellido_cliente, cl.edad, ci.nombre_ciudad, p.nombre_pais
FROM clientes cl
NATURAL JOIN ciudades ci
NATURAL JOIN paises p
;

CREATE table clientes_productos (
id_clientes_productos int auto_increment not null primary key,
id_cliente int not null,
id_producto int not null,
cantidad int not null	
);


insert into clientes_productos(id_cliente, id_producto, cantidad)
VALUES (1, 1, 2); 

-- Mostrar qué cliente ha comprado cual producto
SELECT cl.nombre_cliente, cl.apellido_cliente, cl.edad, 
p.nombre_producto, p.precio_producto, cp.cantidad, 
(p.precio_producto * cp.cantidad) as total
FROM clientes cl
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
;

ALTER TABLE `clientes3`.`ciudades` 
ADD INDEX `fk_paises_idx` (`id_pais` ASC) VISIBLE;
;
ALTER TABLE `clientes3`.`ciudades` 
ADD CONSTRAINT `fk_paises`
  FOREIGN KEY (`id_pais`)
  REFERENCES `clientes3`.`paises` (`id_pais`)
  ON DELETE NO ACTION
  ON UPDATE CASCADE;
  
  
ALTER TABLE clientes
ADD FOREIGN KEY (id_ciudad)
REFERENCES ciudades(id_ciudad)
ON UPDATE CASCADE;

alter table clientes_productos
add constraint fk_clientes_cp
foreign key(id_cliente)
references clientes(id_cliente)
on update cascade;

alter table clientes_productos
add constraint fk_productos_cp
foreign key(id_producto)
references productos(id_producto)
on update cascade;

insert into clientes_productos(id_cliente, id_producto, cantidad) values
(3, 5, 4), (6, 4, 1), (6, 4, 6);
insert into clientes_productos(id_cliente, id_producto, cantidad) values
(6, 3, 5), (7, 1, 4), (5, 4, 6);

-- Mostrar las compras de los clientes del Reino Unido
-- Debe aparecer: 
--    nombre y apellido del cliente, 
--    el nombre y precio del producto
--    el cantidad y total de la compra

SELECT cl.nombre_cliente, cl.apellido_cliente, 
p.nombre_producto, p.precio_producto, 
cp.cantidad, concat((p.precio_producto * cp.cantidad), "€") as total
FROM paises
NATURAL JOIN ciudades
NATURAL JOIN clientes cl
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
WHERE paises.nombre_pais = "Reino Unido"
ORDER BY total desc;

-- Mostrar los totales de compra de cada país que ha comprado algo
SELECT nombre_pais as "País", sum((p.precio_producto * cp.cantidad)) as "Total compra"
FROM paises
NATURAL JOIN ciudades
NATURAL JOIN clientes cl
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
GROUP BY nombre_pais
;
-- Mostrar la información del producto más caro
-- ¿Cúal es el precio más alto?
SELECT max(precio_producto) FROM productos;	

SELECT *
FROM productos
WHERE precio_producto = (SELECT max(precio_producto) FROM productos)
;


-- Mostrar los clientes que han hecho más de dos compras
SELECT nombre_cliente, apellido_cliente, count(cp.id_cliente) as "Total compras"
FROM clientes
NATURAL JOIN clientes_productos cp
GROUP BY cp.id_cliente
HAVING `Total compras` > 2
;

-- Mostrar la facturación de cada cliente
SELECT nombre_cliente, apellido_cliente, sum(cp.cantidad * p.precio_producto) as "Total compra"	
FROM clientes 
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
GROUP BY cp.id_cliente
ORDER BY `Total compra` desc
;














SELECT nombre_cliente, apellido_cliente, sum((p.precio_producto * cp.cantidad)) as total
FROM clientes
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
GROUP BY cp.id_cliente
ORDER BY total desc
;

-- Mostrar qué clientes no han comprado nada
-- El id de los clientes qué han comprado algo
SELECT DISTINCT id_cliente
FROM clientes_productos;

SELECT id_cliente, nombre_cliente, apellido_cliente
FROM clientes
WHERE id_cliente NOT IN (SELECT DISTINCT id_cliente FROM clientes_productos)
;










SELECT DISTINCT nombre_cliente, apellido_cliente
FROM clientes
WHERE id_cliente NOT IN (SELECT DISTINCT id_cliente FROM clientes_productos)
;


-- Mostrar qué cliente ha comprado más
SELECT nombre_cliente, apellido_cliente, 
sum(cp.cantidad * p.precio_producto) as total	
FROM clientes 
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
GROUP BY cp.id_cliente
HAVING total = (
	SELECT sum(cp.cantidad * p.precio_producto) as total	
	FROM clientes 
	NATURAL JOIN clientes_productos cp
	NATURAL JOIN productos p
	GROUP BY cp.id_cliente
	ORDER BY total desc
	LIMIT 1
)
ORDER BY total desc
;

SELECT sum(cp.cantidad * p.precio_producto) as total	
FROM clientes 
NATURAL JOIN clientes_productos cp
NATURAL JOIN productos p
GROUP BY cp.id_cliente
ORDER BY total desc
LIMIT 1
;

-- Insertamos valores de prueba
INSERT INTO productos(nombre_producto, precio_producto) 
values ("test", 4987.98);
insert into clientes_productos(id_cliente, id_producto, cantidad) 
VALUES (2, 10, 1);

-- Una vez comprobado que funciona lo podemos borrar
DELETE FROM clientes_productos WHERE id_producto = 10;
DELETE FROM productos WHERE id_producto = 10;
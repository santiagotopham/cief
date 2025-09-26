SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

DROP DATABASE IF EXISTS renting_cars;
CREATE DATABASE IF NOT EXISTS renting_cars;
USE renting_cars;

CREATE TABLE IF NOT EXISTS clientes (
id_cliente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nombre_cliente VARCHAR(25) NOT NULL,
apellido_cliente VARCHAR(50) NOT NULL,
dni_conductor VARCHAR(15) NOT NULL,
carnet_conducir VARCHAR(15) NOT NULL,
cif_empresa VARCHAR(15),
email_cliente VARCHAR(100) NOT NULL,
telefono VARCHAR(15),
poblacion_residencia VARCHAR(15), 
id_pais int,
password_cliente VARCHAR(10) NOT NULL,
tipo_cliente ENUM("particular","empresa") DEFAULT "particular"
);

CREATE TABLE paises (
id_pais INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nombre_pais varchar(50)
);

CREATE TABLE concesionarios (
id_concesionario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nombre_concesionario VARCHAR(25) NOT NULL UNIQUE,
nombre_contacto VARCHAR(25) NOT NULL,
apellido_contacto VARCHAR(50) NOT NULL,
tel_concesionario VARCHAR(15) NOT NULL,
email_concesionario VARCHAR(100) NOT NULL,
cif_concesionario VARCHAR(12) NOT NULL UNIQUE
);

CREATE TABLE modelos (
id_modelo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
marca VARCHAR(20) NOT NULL,
nombre_modelo VARCHAR(20) NOT NULL,
puertas int NOT NULL,
plazas int NOT NULL,
cambio ENUM("manual", "automatico") DEFAULT "manual",
tipo_vehiculo ENUM("coche", "moto", "furgoneta") DEFAULT "coche"
);

CREATE TABLE vehiculos (
id_vehiculo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_modelo int,
color varchar(12) NOT NULL,
matricula varchar(7) NOT NULL UNIQUE,
precio_dia DECIMAL(5,2) NOT NULL,
incidencias varchar(500) DEFAULT "ninguna",
unidades int unsigned DEFAULT 1
);

ALTER TABLE vehiculos
ADD COLUMN id_concesionario int after id_modelo;


CREATE TABLE alquileres (
id_alquiler INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_cliente int NOT NULL,
id_vehiculo int NOT NULL,
fecha_recogida DATE NOT NULL,
fecha_devolucion DATE
);

ALTER TABLE `renting_cars`.`alquileres` 
ADD INDEX `FK_CLIENTES_ALQUILERES_idx` (`id_cliente` ASC) VISIBLE;

ALTER TABLE `renting_cars`.`alquileres` 
ADD CONSTRAINT `FK_CLIENTES_ALQUILERES`
  FOREIGN KEY (`id_cliente`)
  REFERENCES `renting_cars`.`clientes` (`id_cliente`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
  
ALTER TABLE `renting_cars`.`alquileres` 
ADD INDEX `FK_VEHICULOS_ALQUILERES_idx` (`id_vehiculo` ASC) VISIBLE;

ALTER TABLE `renting_cars`.`alquileres` 
ADD CONSTRAINT `FK_VEHICULOS_ALQUILERES`
  FOREIGN KEY (`id_vehiculo`)
  REFERENCES `renting_cars`.`vehiculos` (`id_vehiculo`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
  
ALTER TABLE `renting_cars`.`clientes` 
ADD INDEX `FK_PAISES_CLIENTES_idx` (`id_pais` ASC) VISIBLE;

ALTER TABLE `renting_cars`.`clientes` 
ADD CONSTRAINT `FK_PAISES_CLIENTES`
  FOREIGN KEY (`id_pais`)
  REFERENCES `renting_cars`.`paises` (`id_pais`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `renting_cars`.`vehiculos` 
ADD INDEX `FK_CONCESIONARIOS_VEHICULOS_idx` (`id_concesionario` ASC) VISIBLE;

ALTER TABLE `renting_cars`.`vehiculos` 
ADD CONSTRAINT `FK_CONCESIONARIOS_VEHICULOS`
  FOREIGN KEY (`id_concesionario`)
  REFERENCES `renting_cars`.`concesionarios` (`id_concesionario`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

ALTER TABLE `renting_cars`.`vehiculos` 
ADD INDEX `FK_MODELOS_VEHICULOS_idx` (`id_modelo` ASC) VISIBLE;

ALTER TABLE `renting_cars`.`vehiculos` 
ADD CONSTRAINT `FK_MODELOS_VEHICULOS`
  FOREIGN KEY (`id_modelo`)
  REFERENCES `renting_cars`.`modelos` (`id_modelo`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

INSERT INTO PAISES (nombre_pais) 
VALUES ("España"),("Francia"),("Italia"),("Alemania");

INSERT INTO clientes (nombre_cliente, apellido_cliente, dni_conductor, 
carnet_conducir, cif_empresa, email_cliente, telefono, poblacion_residencia,
id_pais, password_cliente) VALUES
("Bill", "Gates", "111111111","111111111", NULL, "bill@gates.com",
"111111111", "Santa Coloma", "1", "1234"),
("Steve", "Jobs", "222222222","222222222", NULL, "steve@jobs.com",
"222222222", "Santa Coloma", "1", "1234"),
("Elon", "Musk", "333333333","333333333", NULL, "elon@musk.com",
"333333333", "Badalona", "3", "1234"),
("Jeff", "Bezos", "444444444","44444444", NULL, "jeff@bezos.com",
"444444444", "Hospitalet", "1", "1234");

INSERT INTO clientes (nombre_cliente, apellido_cliente, dni_conductor, 
carnet_conducir, cif_empresa, email_cliente, telefono, poblacion_residencia,
id_pais, password_cliente, tipo_cliente) VALUES
("Amazon", "", "111111111","111111111", "1234A", "amazon@amazon.com",
"111111111", "Santa Coloma", "1", "5678", "empresa"),
("Apple", "", "222222222","222222222", "1234B", "apple@apple.com",
"222222222", "París", "2", "5678", "empresa"),
("X", "", "333333333","333333333", "1234C", "x@x.com",
"333333333", "Badalona", "3", "1234", "empresa"),
("Microsoft", "", "444444444","44444444", "1234D", "ms@ms.com",
"444444444", "Hospitalet", "2", "1234", "empresa");


INSERT INTO concesionarios (nombre_concesionario, nombre_contacto, apellido_contacto, tel_concesionario, email_concesionario, cif_concesionario)
values 
("Asian Cars", "Lewis", "Hamilton", "987654321", "info@asiancars.com", "087654321"),
("VW Motors", "Carlos", "Sáinz", "987654320", "info@vwmotors.com", "987654320"),
("BCN Auto", "Sebastian", "Vettel", "987654322", "info@vwmotors.com", "987654322");

insert into modelos (marca, nombre_modelo, puertas, plazas, cambio, tipo_vehiculo)
values
("Nissan", "Juke", 3, 5, "manual", "coche"),
("Chevrolet", "Captiva", 5, 7, "automatico", "coche"),
("Nissan", "Micra", 5, 5, "manual", "coche"),
("Nissan", "X-Trail", 5, 5, "automatico", "coche"),
("Jeep", "Wrangler", 3, 4, "automatico", "coche"),
("Opel", "Zafira", 5, 7, "manual", "coche"),
("Fiat", "Panda", 5, 4, "manual", "coche"),
("Fiat", "500", 5, 4, "manual", "coche"),
("Nissan", "Primastar", 5, 9, "manual", "furgoneta"),
("Reault", "Trafic", 5, 9, "automatico", "furgoneta"),
("Opel", "Corsa", 5, 5, "manual", "coche"),
("Piaggio", "Typhoon", 0, 2, "automatico", "moto"),
("Piaggio", "Liberty", 0, 2, "automatico", "moto"),
("Suzuki", "Van 125", 0, 2, "manual", "moto"),
("Piaggio", "Vespa", 0, 2, "automatico", "moto");

insert into vehiculos (id_modelo, id_concesionario, color, matricula, precio_dia, unidades)
values (1, 1, "rojo", "0001ABC", 79, 2 ), (3, 1, "blanco", "0003ABC", 53, 5 ), (2, 3, "plata", "0002ABC", 187, 2 ), (4, 1, "negro", "0004ABC", 187, 3 ), 
(5, 2, "plata", "0005ABC", 104, 3 ), (9, 1, "plata", "0009ABC", 143, 1 ), (10, 3, "negro", "0010ABC", 185, 2 ), (12, 3, "negro", "0012ABC", 23 , 5);

-- insert into modelos (marca, nombre_modelo, puertas, plazas, cambio, tipo_vehiculo)
-- values ("Nissan", "Juke", 3, 5, "manual", "barco");

insert into alquileres (id_cliente, id_vehiculo, fecha_recogida, fecha_devolucion)
values (1, 1, "2024-02-01", "2024-02-11"), (1, 8, "2024-02-12", "2024-02-13"), (1, 3, "2024-02-20", "2024-03-15"),(1, 7, "2024-03-20", "2024-07-15"),
(2, 1, "2024-01-01", "2024-02-11"), (2, 3, "2024-01-15", "2024-08-14"), (3, 5, "2024-02-20", "2024-03-15"),(6, 8, "2024-04-20", "2024-07-15");

insert into alquileres (id_cliente, id_vehiculo, fecha_recogida, fecha_devolucion)
values (8, 5, "2024-09-11", null);

insert into alquileres (id_cliente, id_vehiculo, fecha_recogida, fecha_devolucion)
values (4, 3, "2023-12-11", "2023-12-21"), (2, 5, "2023-12-14", "2023-12-29");


use santiagotopham;

create table `sweets`
(
`id` int not null auto_increment,
`menu_name_cat` varchar(30) not null,
`name_cat` varchar(30) not null,
`descripcio_cat` varchar(100) null,
`menu_name_esp` varchar(30) not null,
`name_esp` varchar(30) not null,
`descripcio_esp` varchar(100) null,
`preu` varchar(15) not null,
`img`  varchar(500) not null,
primary key (id)
);

insert into sweets
(menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, preu, img)
values
('Castanyada','Panellets de pinyons','Elaborats amb pinyons de primera qualitat.','Castañada','Panellets de piñones','Elaborados con piñones de primera calidad.','7.95 €/Kg','panellets-pinyons.jpeg'),
('Castanyada','Panellets d''ametlla','Fets amb ametlles torrades i sucre.','Castañada','Panellets de almendra','Hechos con almendras tostadas y azúcar.','6.95 €/Kg','panellets-dametlla-2.jpeg'),
('Castanyada','Assortiment de panellets','Assortiment de panellets: pinyons, ametlla i coco.','Castañada','Surtido de panellets','Surtido de panellets: piñones, almendra y coco.','7.25 €/Kg','Panellets-assortiment.webp'),
('Castanyada','Castanyes al forn','Castanyes al forn acabades de coure.','Castañada','Castañas al horno','Castañas al horno recién hechas.','5.25 €/Kg','castanyes.webp'),
('Pastissos','Pastís de xocolata','Pastís esponjós amb cobertura de xocolata negra.','Pasteles','Pastel de chocolate','Pastel esponjoso con cobertura de chocolate negro','15.00 €/u','pastis-de-xocolata_2.jpg'),
('Pastissos','Pastís de maduixa','Pastís fresc amb crema i maduixes naturals.','Pasteles','Pastel de fresa','Pastel fresco con crema y fresas naturales.','14.50 €/u','pastis-de-maduixa.webp'),
('Brioixeria','Croissant de mantega','Croissant artesanal fet amb mantega de primera qualitat.','Bollería','Croissant de mantequilla','Croissant artesanal hecho con mantequilla de primera calidad.','2.50 €/u','croissants.webp'),
('Brioixeria','Croissant de xocolata','Croissant farcit de xocolata suau i cremosa.','Bollería','Croissant de chocolate','Croissant relleno de chocolate suave y cremoso.','2.80 €/u','croissant_xocolata.webp'),
('Brioixeria','Ensaimada','Ensaimada tradicional mallorquina, lleugera i esponjosa.','Bollería','Ensaimada','Ensaimada tradicional mallorquina, ligera y esponjosa.','3.00 €/u','ensaimada.webp');

select * from sweets;

create user 'magda'@'localhost' identified by 'magda';

grant select on santiagotopham.* to 'magda'@'localhost';
grant insert on santiagotopham.* to 'magda'@'localhost';
grant update, delete on santiagotopham.* to 'magda'@'localhost';
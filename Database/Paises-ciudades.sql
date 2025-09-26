CREATE TABLE cief.Paises (
	PaisId int auto_increment primary key,
	Nombre varchar(50) not null,
	Codigo varchar(4) null
);

CREATE TABLE cief.Ciudades (
	CiudadId int auto_increment primary key,
	PaisId int not null,
	Nombre varchar(50) not null,
    CONSTRAINT FK_Ciudades_Paises FOREIGN KEY (PaisId) REFERENCES Paises(PaisId) on delete no action on update cascade
);

CREATE INDEX IX_FK_Ciudades_Paises ON cief.Ciudades (PaisId);

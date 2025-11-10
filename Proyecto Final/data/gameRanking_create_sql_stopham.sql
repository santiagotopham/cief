use gameRanking_stopham;

create user 'gaming'@'localhost' identified by 'gaming';

grant select on gameRanking_stopham.* to 'gaming'@'localhost';
grant insert on gameRanking_stopham.* to 'gaming'@'localhost';
grant update, delete on gameRanking_stopham.* to 'gaming'@'localhost';

create table Genres (
	Id int auto_increment not null,
	Name varchar(50) not null,
    primary key (Id),
    unique (Name)
);

create table MainPlatforms (
	Id int auto_increment not null,
	Name varchar(50) not null,
    primary key (Id),
    unique (Name)
);

create table Platforms (
	Id int auto_increment not null,
    MainPlatformId int not null,
	Name varchar(50) not null,
    primary key (Id),
    unique (Name),
    foreign key (MainPlatformId) references MainPlatforms(Id)
);

create table Games (
	Id int auto_increment not null,
	Title varchar(100) not null,
	ImageUrl varchar(200) not null,
    LaunchDate datetime not null,
    Developer varchar(100) not null,
	Category varchar(3) not null,
    Synopsis varchar(1000) null,
    ThumbsUpCounter int not null,
    primary key (Id),
    unique (Title)
);

create table GenresPerGame (
	GenreId int not null,
	GameId int not null,
    primary key (GenreId, GameId),
    foreign key (GenreId) references Genres(Id),
    foreign key (GameId) references Games(Id),
    unique (GenreId, GameId)
);

create table PlatformsPerGame (
	PlatformId int not null,
	GameId int not null,
    primary key (PlatformId, GameId),
    foreign key (PlatformId) references Platforms(Id),
    foreign key (GameId) references Games(Id),
    unique (PlatformId, GameId)
);

create table Comments (
	Id int auto_increment not null,
	GameId int not null,
	UserName varchar(50) not null,
    PublishedDate datetime not null,
    Text varchar(1000) not null,
    primary key (Id),
    foreign key (GameId) references Games(Id)
);

create table Users (
	Id int auto_increment not null,
	UserName varchar(50) not null,
	Password varchar(50) not null,
    primary key (Id),
    unique (UserName)
);

-- Data

insert into Genres
(Name)
values
('Acción'),
('Aventura'),
('Rol'),
('Estrategia'),
('Simulación'),
('Deportes'),
('Carreras'),
('Disparos'),
('Plataformas'),
('Lucha'),
('Puzzle / Rompecabezas'),
('Survival'),
('Horror'),
('Mundo Abierto'),
('Musical / Ritmo');

insert into MainPlatforms
(Name)
values
('PC'),
('Xbox'),
('Nintendo'),
('PlayStation');

insert into Platforms
(Name, MainPlatformId)
values
('PC', (select Id from MainPlatforms m where Name = 'PC')),
('Xbox Series X/S', (select Id from MainPlatforms m where Name = 'Xbox')),
('Switch 1', (select Id from MainPlatforms m where Name = 'Nintendo')),
('Switch 2', (select Id from MainPlatforms m where Name = 'Nintendo')),
('PlayStation 4', (select Id from MainPlatforms m where Name = 'PlayStation')),
('PlayStation 5', (select Id from MainPlatforms m where Name = 'PlayStation'));

insert into Games
(Title, ImageUrl, LaunchDate, Developer, Category, Synopsis, ThumbsUpCounter)
values
('ARC Raiders', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co9rk1.webp', '2025-10-30', 'Embark Studios', 'AA', 'ARC Raiders es una aventura de extracción multijugador, ambientada en una tierra futura letal, devastada por una misteriosa amenaza mecanizada conocida como ARC.', 0),
('Hollow Knight: Silksong', 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaend.webp', '2025-9-4', 'Team Cherry', 'A', 'Hollow Knight: Silksong es la secuela épica de Hollow Knight, la épica aventura de acción de bichos y héroes. Como el cazador letal Hornet, viaja a tierras completamente nuevas, descubre nuevos poderes, lucha contra vastas hordas de insectos y bestias y descubre antiguos secretos relacionados con tu naturaleza y tu pasado.', 0),
('Baldur`s Gate III', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.webp', '2023-8-3', 'Larian Studios', 'AA', 'Un antiguo mal ha regresado a Baldur`s Gate, con la intención de devorarlo de adentro hacia afuera. El destino de Faerun está en tus manos. Solo, puede resistirse. Pero juntos, pueden superarlo.', 0),
('Elden Ring', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp', '2022-2-25', 'FromSoftware', 'AAA', 'Elden Ring es un juego de rol de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment, lanzado en febrero de 2022. Dirigido por Hidetaka Miyazaki, con contribuciones de construcción de mundos del novelista George RR Martin, el juego presenta un mundo abierto expansivo llamado Lands Between. Los jugadores asumen el papel de un personaje personalizable conocido como Tarnished, que debe explorar este mundo, luchar contra enemigos formidables y buscar restaurar Elden Ring para convertirse en Elden Lord.', 0),
('The Witcher 3: Wild Hunt', 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaarl.webp', '2015-5-19', 'CD Projekt RED', 'AAA', 'Ambientado en un mundo de fantasía oscura, el juego sigue a Geralt de Rivia, un cazador de monstruos que busca a su hija adoptiva, Ciri, mientras navega por conflictos políticos y amenazas sobrenaturales. El juego presenta exploración, combate, progresión de personajes y narrativas ramificadas moldeadas por las elecciones del jugador. Ampliamente aclamado por su escritura, construcción de mundos y profundidad, es considerado uno de los juegos de rol más influyentes de su generación.', 0),
('Red Dead Redemption 2', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp', '2018-10-26', 'Rockstar Games', 'AAA', 'Red Dead Redemption 2 es la historia épica del forajido Arthur Morgan y la infame pandilla Van der Linde, que huyen por Estados Unidos en los albores de la era moderna.', 0),
('The Last of Us', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.webp', '2013-6-14', 'Naughty Dog', 'AAA', 'The Last of Us es un juego de acción y aventuras en tercera persona que presenta una mezcla de exploración, sigilo y combate. Los jugadores se enfrentan tanto a criaturas infectadas como a enemigos humanos hostiles mientras progresan a través de entornos variados. El juego incluye una campaña narrativa para un jugador y un modo multijugador competitivo en línea llamado Factions. Se incluye soporte para trofeos y el contenido descargable adicional está disponible por separado.', 0),
('Clair Obscur: Expedition 33', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co9gam.webp', '2025-4-24', 'Sandfall Interactive', 'AA', 'Lidera a los miembros de la Expedición 33 en su búsqueda para destruir a la Paintress para que nunca más pueda pintar la muerte. Explora un mundo de maravillas inspirado en la Francia de la Belle Époque y lucha contra enemigos únicos en este juego de rol por turnos con mecánicas en tiempo real.', 0);


insert into GenresPerGame
(GenreId, GameId)
values
((select Id from Genres g where g.Name = 'Acción'), (select Id from Games g where g.Title = 'ARC Raiders')),
((select Id from Genres g where g.Name = 'Disparos'), (select Id from Games g where g.Title = 'ARC Raiders')),
((select Id from Genres g where g.Name = 'Plataformas'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Genres g where g.Name = 'Rol'), (select Id from Games g where g.Title = 'Baldur`s Gate III')),
((select Id from Genres g where g.Name = 'Estrategia'), (select Id from Games g where g.Title = 'Baldur`s Gate III')),
((select Id from Genres g where g.Name = 'Rol'), (select Id from Games g where g.Title = 'Elden Ring')),
((select Id from Genres g where g.Name = 'Aventura'), (select Id from Games g where g.Title = 'Elden Ring')),
((select Id from Genres g where g.Name = 'Rol'), (select Id from Games g where g.Title = 'The Witcher 3: Wild Hunt')),
((select Id from Genres g where g.Name = 'Aventura'), (select Id from Games g where g.Title = 'The Witcher 3: Wild Hunt')),
((select Id from Genres g where g.Name = 'Rol'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Genres g where g.Name = 'Aventura'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Genres g where g.Name = 'Disparos'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Genres g where g.Name = 'Aventura'), (select Id from Games g where g.Title = 'The Last of Us')),
((select Id from Genres g where g.Name = 'Disparos'), (select Id from Games g where g.Title = 'The Last of Us')),
((select Id from Genres g where g.Name = 'Rol'), (select Id from Games g where g.Title = 'Clair Obscur: Expedition 33')),
((select Id from Genres g where g.Name = 'Aventura'), (select Id from Games g where g.Title = 'Clair Obscur: Expedition 33'));

insert into PlatformsPerGame
(PlatformId, GameId)
values
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'ARC Raiders')),
((select Id from Platforms p where p.Name = 'Xbox Series X/S'), (select Id from Games g where g.Title = 'ARC Raiders')),
((select Id from Platforms p where p.Name = 'PlayStation 5'), (select Id from Games g where g.Title = 'ARC Raiders')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'Xbox Series X/S'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'Switch 1'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'Switch 2'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'PlayStation 4'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'PlayStation 5'), (select Id from Games g where g.Title = 'Hollow Knight: Silksong')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'Baldur`s Gate III')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'Elden Ring')),
((select Id from Platforms p where p.Name = 'PlayStation 5'), (select Id from Games g where g.Title = 'Elden Ring')),
((select Id from Platforms p where p.Name = 'PlayStation 4'), (select Id from Games g where g.Title = 'The Witcher 3: Wild Hunt')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'The Witcher 3: Wild Hunt')),
((select Id from Platforms p where p.Name = 'Xbox Series X/S'), (select Id from Games g where g.Title = 'The Witcher 3: Wild Hunt')),
((select Id from Platforms p where p.Name = 'Xbox Series X/S'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Platforms p where p.Name = 'PlayStation 4'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Platforms p where p.Name = 'PlayStation 5'), (select Id from Games g where g.Title = 'Red Dead Redemption 2')),
((select Id from Platforms p where p.Name = 'PlayStation 4'), (select Id from Games g where g.Title = 'The Last of Us')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'The Last of Us')),
((select Id from Platforms p where p.Name = 'PC'), (select Id from Games g where g.Title = 'Clair Obscur: Expedition 33')),
((select Id from Platforms p where p.Name = 'PlayStation 5'), (select Id from Games g where g.Title = 'Clair Obscur: Expedition 33'));

insert into Users
(UserName, Password)
values
('admin', 'admin');
CREATE DATABASE  IF NOT EXISTS `gameranking_stopham` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gameranking_stopham`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: gameranking_stopham
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GameId` int NOT NULL,
  `UserName` varchar(50) NOT NULL,
  `PublishedDate` datetime NOT NULL,
  `Text` varchar(1000) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `GameId` (`GameId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`GameId`) REFERENCES `games` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (4,1,'admin','2025-11-13 11:48:45','Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi provident ab animi quisquam possimus illum aspernatur, placeat odio eos dolorum?'),(5,2,'pepe','2025-11-13 11:49:05','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt blanditiis alias ipsam enim dignissimos vel?'),(6,2,'juan','2025-11-13 11:49:19','Lorem ipsum dolor sit amet.'),(7,3,'juan','2025-11-13 11:49:59','Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit quia debitis esse harum hic at. Sequi animi architecto esse tempora perferendis cum ex commodi nulla, illum ipsum aut dolores voluptatibus.'),(8,6,'max','2025-11-13 11:50:21','Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, laborum?'),(9,6,'arthur','2025-11-13 11:50:34','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod deserunt dignissimos molestias, consequatur voluptates, sit sed consectetur vero similique dolores expedita praesentium ipsam totam ab.'),(10,6,'jose','2025-11-13 11:50:49','Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi consectetur veritatis porro quam praesentium esse tempore omnis.'),(11,4,'jair','2025-11-13 12:14:28','Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi, quos!'),(12,55,'marta','2025-11-13 12:14:55','Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore voluptatibus, earum natus nostrum corrupti ab ratione sit possimus aperiam minus mollitia consectetur repellat libero maiores!'),(13,56,'oscar','2025-11-13 12:15:14','Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum velit, inventore delectus unde suscipit autem, maxime similique quos consequuntur repudiandae id atque distinctio nulla dolore? Quod, consequatur?'),(14,50,'kahrem','2025-11-13 12:15:32','Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, similique ullam accusamus dolorum blanditiis aliquid modi nisi! Blanditiis, nobis repudiandae. Animi est tempora exercitationem in modi quibusdam ex! Blanditiis, quas.'),(15,48,'rene','2025-11-13 12:15:52','Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate incidunt minus expedita.'),(17,47,'Mark','2025-11-15 13:01:07','Hey!'),(18,7,'Maia','2025-11-15 13:07:20','Lorem ipsum!'),(19,1,'test','2025-11-15 13:36:36','test');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) NOT NULL,
  `ImageUrl` varchar(200) NOT NULL,
  `LaunchDate` datetime NOT NULL,
  `Developer` varchar(100) NOT NULL,
  `Category` varchar(3) NOT NULL,
  `Synopsis` varchar(1000) DEFAULT NULL,
  `ThumbsUpCounter` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Title` (`Title`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'ARC Raiders','https://images.igdb.com/igdb/image/upload/t_cover_big/co9rk1.webp','2025-10-30 00:00:00','Embark Studios','AA','ARC Raiders es una aventura de extracción multijugador, ambientada en una tierra futura letal, devastada por una misteriosa amenaza mecanizada conocida como ARC.',2),(2,'Hollow Knight: Silksong','https://images.igdb.com/igdb/image/upload/t_cover_big/coaend.webp','2025-09-04 00:00:00','Team Cherry','A','Hollow Knight: Silksong es la secuela épica de Hollow Knight, la épica aventura de acción de bichos y héroes. Como el cazador letal Hornet, viaja a tierras completamente nuevas, descubre nuevos poderes, lucha contra vastas hordas de insectos y bestias y descubre antiguos secretos relacionados con tu naturaleza y tu pasado.',7),(3,'Baldur`s Gate III','https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.webp','2023-08-03 00:00:00','Larian Studios','AA','Un antiguo mal ha regresado a Baldur`s Gate, con la intención de devorarlo de adentro hacia afuera. El destino de Faerun está en tus manos. Solo, puede resistirse. Pero juntos, pueden superarlo.',1),(4,'Elden Ring','https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp','2022-02-25 00:00:00','FromSoftware','AAA','Elden Ring es un juego de rol de acción desarrollado por FromSoftware y publicado por Bandai Namco Entertainment, lanzado en febrero de 2022. Dirigido por Hidetaka Miyazaki, con contribuciones de construcción de mundos del novelista George RR Martin, el juego presenta un mundo abierto expansivo llamado Lands Between. Los jugadores asumen el papel de un personaje personalizable conocido como Tarnished, que debe explorar este mundo, luchar contra enemigos formidables y buscar restaurar Elden Ring para convertirse en Elden Lord.',2),(5,'The Witcher 3: Wild Hunt','https://images.igdb.com/igdb/image/upload/t_cover_big/coaarl.webp','2015-05-19 00:00:00','CD Projekt RED','AAA','Ambientado en un mundo de fantasía oscura, el juego sigue a Geralt de Rivia, un cazador de monstruos que busca a su hija adoptiva, Ciri, mientras navega por conflictos políticos y amenazas sobrenaturales. El juego presenta exploración, combate, progresión de personajes y narrativas ramificadas moldeadas por las elecciones del jugador. Ampliamente aclamado por su escritura, construcción de mundos y profundidad, es considerado uno de los juegos de rol más influyentes de su generación.',-1),(6,'Red Dead Redemption 2','https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp','2018-10-26 00:00:00','Rockstar Games','AAA','Red Dead Redemption 2 es la historia épica del forajido Arthur Morgan y la infame pandilla Van der Linde, que huyen por Estados Unidos en los albores de la era moderna.',11),(7,'The Last of Us','https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.webp','2013-06-14 00:00:00','Naughty Dog','AAA','The Last of Us es un juego de acción y aventuras en tercera persona que presenta una mezcla de exploración, sigilo y combate. Los jugadores se enfrentan tanto a criaturas infectadas como a enemigos humanos hostiles mientras progresan a través de entornos variados. El juego incluye una campaña narrativa para un jugador y un modo multijugador competitivo en línea llamado Factions. Se incluye soporte para trofeos y el contenido descargable adicional está disponible por separado.',3),(8,'Clair Obscur: Expedition 33','https://images.igdb.com/igdb/image/upload/t_cover_big/co9gam.webp','2025-04-24 00:00:00','Sandfall Interactive','AA','Lidera a los miembros de la Expedición 33 en su búsqueda para destruir a la Paintress para que nunca más pueda pintar la muerte. Explora un mundo de maravillas inspirado en la Francia de la Belle Époque y lucha contra enemigos únicos en este juego de rol por turnos con mecánicas en tiempo real.',0),(46,'Dragon Ball: Sparking! Zero','https://images.igdb.com/igdb/image/upload/t_cover_big/co8bhn.webp','2024-11-10 00:00:00','Spike Chunsoft','AAA','Dragon Ball: ¡Chispas! Zero toma la legendaria jugabilidad de la serie Budokai Tenkaichi y la eleva a niveles completamente nuevos. ¡Haz tuyo el poder destructivo de los luchadores más fuertes que jamás hayan aparecido en Dragon Ball!',3),(47,'Dispatch','https://images.igdb.com/igdb/image/upload/t_cover_big/co95gb.webp','2025-10-22 00:00:00','AdHoc Studio','AA','Dispatch es una comedia de superhéroes en el lugar de trabajo donde las elecciones importan. Administra un equipo disfuncional de héroes inadaptados y elabora estrategias para enviar a emergencias en la ciudad, todo mientras equilibras la política de la oficina, las relaciones personales y tu propia búsqueda para convertirte en un héroe.',0),(48,'Arena Breakout: Infinite','https://images.igdb.com/igdb/image/upload/t_cover_big/coabe0.webp','2025-09-15 00:00:00','Morefun Studio Group','AA','Arena Breakout: Infinite es una simulación militar inmersiva ultrarreal. Únete a una lucha para disparar, saquear y asaltar tu camino hacia la fortuna.',4),(49,'Persona 5','https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.webp','2016-12-09 00:00:00','Atlus','AA','Persona 5, un JRPG por turnos con elementos de novela visual, sigue a un estudiante de secundaria con antecedentes penales por un crimen que no cometió. Pronto conoce a varios personajes que comparten destinos similares a los suyos, y descubre un reino metafísico que le permite a él y a sus amigos canalizar sus frustraciones reprimidas para convertirse en un grupo de vigilantes que se deleitan con la estética y la rebelión mientras luchan contra la corrupción.',-2),(50,'God of War','https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp','2018-04-20 00:00:00','SIE Santa Monica Studio','AAA','God of War es la secuela de God of War III, así como una continuación de la cronología canónica de God of War. A diferencia de las entregas anteriores, este juego se centra en la mitología nórdica y sigue a un Kratos mayor y más experimentado y a su hijo Atreus en los años transcurridos desde el tercer juego. Es en este mundo duro e implacable donde debe luchar para sobrevivir... y enseñarle a su hijo a hacer lo mismo.',1),(51,'Castlevania: Symphony of the Night','https://images.igdb.com/igdb/image/upload/t_cover_big/co53m8.webp','1997-03-20 00:00:00','Konami Computer Entertainment Tokyo','A','Habiendo sido despertado de su sueño eterno por la reaparición de Castlevania, Alucard debe enfrentarse una vez más a los malvados secuaces de la oscuridad. Usa tus poderes vampíricos, junto con armas, pociones y otras reliquias mágicas para cambiar el rumbo de la batalla. Una mezcla de plataformas y acción de rol con muchas áreas ocultas y secretos. ¿Puedes descubrirlos todos?',1),(52,'Bloodborne','https://images.igdb.com/igdb/image/upload/t_cover_big/co1rba.webp','2015-03-24 00:00:00','FromSoftware','AAA','Un juego de rol de acción en el que el jugador encarna a un cazador que, después de ser transfundido con la misteriosa sangre local de la ciudad de Yharnam, se embarca en una \"noche de la caza\", una noche extendida en la que los cazadores pueden entrar y salir del sueño y la realidad para reducir el brote de bestias abominables que plagan la tierra y, para los cazadores más resistentes y perspicaces, descubra las respuestas a los muchos misterios de la caza.',6),(53,'Portal 2','https://images.igdb.com/igdb/image/upload/t_cover_big/co1rs4.webp','2018-04-18 00:00:00','Valve','AAA','Secuela del aclamado Portal (2007), Portal 2 enfrenta a la protagonista del juego original, Chell, y a su nuevo amigo robot, Wheatley, contra más acertijos concebidos por GLaDOS, una IA con el único propósito de probar la mecánica de Portal Gun y vengarse de Chell por los eventos de Portal. Como resultado de varias interacciones y revelaciones, Chell una vez más presiona para escapar de Aperture Science Labs.',6),(54,'Sekiro: Shadows Die Twice','https://images.igdb.com/igdb/image/upload/t_cover_big/co2a23.webp','2019-03-22 00:00:00','FromSoftware','AAA','Sekiro: Shadows Die Twice es un juego de acción y aventuras ambientado en un Japón reinventado de finales de 1500 de la era Sengoku. Los jugadores controlan a Wolf, un shinobi en una misión para rescatar a su señor secuestrado y vengarse de sus enemigos. El juego enfatiza el combate preciso con espadas, el sigilo y la movilidad, reemplazando los elementos tradicionales de los juegos de rol con un sistema de duelo basado en la postura.',2),(55,'Resident Evil 4','https://images.igdb.com/igdb/image/upload/t_cover_big/co2wk8.webp','2005-01-11 00:00:00','Capcom Production Studio 4','AAA','Resident Evil 4 es la sexta entrega de la serie Resident Evil y a menudo se destaca por su alejamiento de los ángulos de cámara fijos de títulos anteriores. Introdujo una perspectiva en tercera persona por encima del hombro, un juego de armas de ritmo más rápido y controles más dinámicos. El juego presenta entornos más grandes y abiertos y un nuevo sistema de IA que permite a los enemigos coordinar ataques e intentar arrinconar al jugador. Los enemigos exhiben un comportamiento más humano, como subir escaleras, abrir puertas y usar armas.',8),(56,'The Last of Us Part II','https://images.igdb.com/igdb/image/upload/t_cover_big/co5ziw.webp','2020-06-19 00:00:00','Naughty Dog','AAA','The Last of Us Part II es un juego de acción y aventuras ambientado cinco años después de los eventos de The Last of Us. El jugador atraviesa entornos postapocalípticos como edificios y bosques para avanzar en la historia. Pueden usar armas de fuego, armas improvisadas y sigilo para defenderse de humanos hostiles y criaturas caníbales infectadas por una cepa mutada del hongo Cordyceps. El juego cambia intermitentemente el control entre Ellie y Abby, y también brevemente Joel en la secuencia de apertura. La naturaleza ágil del personaje del jugador introduce elementos de plataformas, lo que permite al jugador saltar y trepar para atravesar entornos y obtener ventajas durante el combate.',0),(57,'God of War Ragnarök','https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.webp','2022-11-09 00:00:00','SIE Santa Monica Studio','AAA','God of War: Ragnarök es la novena entrega de la serie God of War y la secuela de God of War de 2018. Continuando con el tema de la mitología nórdica, el juego está ambientado en la antigua Noruega y presenta a los protagonistas de la serie Kratos, el antiguo dios griego de la guerra, y su pequeño hijo Atreus. El juego dio inicio a los eventos de Ragnarök, donde Kratos y Atreus deben viajar a cada uno de los Nueve Reinos en busca de respuestas mientras se preparan para la batalla profetizada que acabará con el mundo.',2);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Acción'),(2,'Aventura'),(7,'Carreras'),(6,'Deportes'),(8,'Disparos'),(4,'Estrategia'),(13,'Horror'),(10,'Lucha'),(14,'Mundo Abierto'),(15,'Musical / Ritmo'),(9,'Plataformas'),(11,'Puzzle / Rompecabezas'),(3,'Rol'),(5,'Simulación'),(12,'Survival');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genrespergame`
--

DROP TABLE IF EXISTS `genrespergame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genrespergame` (
  `GenreId` int NOT NULL,
  `GameId` int NOT NULL,
  PRIMARY KEY (`GenreId`,`GameId`),
  UNIQUE KEY `GenreId` (`GenreId`,`GameId`),
  KEY `GameId` (`GameId`),
  CONSTRAINT `genrespergame_ibfk_1` FOREIGN KEY (`GenreId`) REFERENCES `genres` (`Id`),
  CONSTRAINT `genrespergame_ibfk_2` FOREIGN KEY (`GameId`) REFERENCES `games` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genrespergame`
--

LOCK TABLES `genrespergame` WRITE;
/*!40000 ALTER TABLE `genrespergame` DISABLE KEYS */;
INSERT INTO `genrespergame` VALUES (1,1),(8,1),(9,2),(3,3),(4,3),(2,4),(3,4),(2,5),(3,5),(2,6),(3,6),(8,6),(2,8),(3,8),(10,46),(3,47),(4,47),(11,47),(8,48),(3,49),(5,49),(1,50),(10,50),(2,51),(3,51),(9,51),(2,52),(3,52),(9,53),(11,53),(2,54),(2,55),(8,55),(2,56),(8,56),(2,57),(3,57);
/*!40000 ALTER TABLE `genrespergame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mainplatforms`
--

DROP TABLE IF EXISTS `mainplatforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mainplatforms` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mainplatforms`
--

LOCK TABLES `mainplatforms` WRITE;
/*!40000 ALTER TABLE `mainplatforms` DISABLE KEYS */;
INSERT INTO `mainplatforms` VALUES (3,'Nintendo'),(1,'PC'),(4,'PlayStation'),(2,'Xbox');
/*!40000 ALTER TABLE `mainplatforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platforms`
--

DROP TABLE IF EXISTS `platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platforms` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `MainPlatformId` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`),
  KEY `MainPlatformId` (`MainPlatformId`),
  CONSTRAINT `platforms_ibfk_1` FOREIGN KEY (`MainPlatformId`) REFERENCES `mainplatforms` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platforms`
--

LOCK TABLES `platforms` WRITE;
/*!40000 ALTER TABLE `platforms` DISABLE KEYS */;
INSERT INTO `platforms` VALUES (1,1,'PC'),(2,2,'Xbox Series X/S'),(3,3,'Switch 1'),(4,3,'Switch 2'),(5,4,'PlayStation 4'),(6,4,'PlayStation 5');
/*!40000 ALTER TABLE `platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platformspergame`
--

DROP TABLE IF EXISTS `platformspergame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platformspergame` (
  `PlatformId` int NOT NULL,
  `GameId` int NOT NULL,
  PRIMARY KEY (`PlatformId`,`GameId`),
  UNIQUE KEY `PlatformId` (`PlatformId`,`GameId`),
  KEY `GameId` (`GameId`),
  CONSTRAINT `platformspergame_ibfk_1` FOREIGN KEY (`PlatformId`) REFERENCES `platforms` (`Id`),
  CONSTRAINT `platformspergame_ibfk_2` FOREIGN KEY (`GameId`) REFERENCES `games` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platformspergame`
--

LOCK TABLES `platformspergame` WRITE;
/*!40000 ALTER TABLE `platformspergame` DISABLE KEYS */;
INSERT INTO `platformspergame` VALUES (1,1),(2,1),(6,1),(1,2),(2,2),(4,2),(6,2),(1,3),(1,4),(6,4),(1,5),(2,5),(5,5),(1,6),(2,6),(5,6),(6,6),(1,7),(5,7),(1,8),(6,8),(1,46),(2,46),(6,46),(1,47),(6,47),(6,48),(1,49),(4,49),(6,49),(1,50),(2,50),(6,50),(1,51),(5,52),(1,53),(2,54),(6,54),(1,55),(2,56),(5,56),(6,56),(2,57),(6,57);
/*!40000 ALTER TABLE `platformspergame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(50) NOT NULL,
  `Password` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserName` (`UserName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-15 14:28:58

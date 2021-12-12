
--
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `block` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1` int NOT NULL,
  `user2` int NOT NULL,
  `block1` int NOT NULL,
  `block2` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `block`
--

LOCK TABLES `block` WRITE;
/*!40000 ALTER TABLE `block` DISABLE KEYS */;
INSERT INTO `block` VALUES (1,1,2,0,1),(2,1,3,0,1),(3,1,6,0,1),(4,6,6,0,1),(5,6,2,0,1),(6,6,3,0,1),(7,8,2,0,1);
/*!40000 ALTER TABLE `block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1` int NOT NULL,
  `user2` int NOT NULL,
  `follow1` int NOT NULL,
  `follow2` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (11,6,2,0,1),(13,6,3,0,1),(14,6,4,0,1),(15,6,5,0,1),(25,8,5,0,1);
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet_likes`
--

DROP TABLE IF EXISTS `tweet_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweet_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tweet_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_likes`
--

LOCK TABLES `tweet_likes` WRITE;
/*!40000 ALTER TABLE `tweet_likes` DISABLE KEYS */;
INSERT INTO `tweet_likes` VALUES (1,3,1),(2,3,2),(3,3,3),(4,2,1),(5,2,2),(6,2,3),(7,4,1),(9,11,6),(10,4,8),(11,6,8);
/*!40000 ALTER TABLE `tweet_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet_media`
--

DROP TABLE IF EXISTS `tweet_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweet_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(225) NOT NULL,
  `media_type` int NOT NULL,
  `tweet_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_media`
--

LOCK TABLES `tweet_media` WRITE;
/*!40000 ALTER TABLE `tweet_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `tweet_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweets`
--

DROP TABLE IF EXISTS `tweets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `author_id` int NOT NULL,
  `type` int NOT NULL DEFAULT '0',
  `parent_tweet` int NOT NULL DEFAULT '0',
  `quoted_tweet` int NOT NULL DEFAULT '0',
  `text` varchar(225) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweets`
--

LOCK TABLES `tweets` WRITE;
/*!40000 ALTER TABLE `tweets` DISABLE KEYS */;
INSERT INTO `tweets` VALUES (2,'2021-02-15 06:41:06',3,0,0,0,'Hello world test'),(3,'2021-02-15 06:41:39',3,0,2,0,'Hello world now'),(5,'2021-02-22 16:50:16',1,0,0,0,'Hello World text with now'),(6,'2021-02-22 16:52:39',2,0,0,0,'Hello World text with now'),(7,'2021-02-22 17:01:46',1,0,0,0,'Hello World text with now'),(8,'2021-02-22 17:02:05',2,0,0,0,'Hello World text with now'),(9,'2021-02-22 17:02:21',1,0,6,0,'Hello World text with now'),(10,'2021-02-22 17:02:57',1,0,2,8,'Hello World text with now'),(11,'2021-02-25 05:37:37',6,0,0,0,'Hi there'),(12,'2021-03-08 09:37:14',8,0,0,0,'Hi m anushree');
/*!40000 ALTER TABLE `tweets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tokens`
--

DROP TABLE IF EXISTS `user_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  `expiry` date NOT NULL,
  `ip` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tokens`
--

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;
INSERT INTO `user_tokens` VALUES (1,'23ee13f6d056246cf0eeb06c4bdae70f','2021-02-24','::1',3),(2,'289b791d6c5d8520a781562c5bc1a6f6','2021-02-24','::1',3),(5,'2f5d1ef78f23dfa8e6b284b74b809dbd','2021-02-25','::1',4),(6,'93c2413de0ec825007186d4fd54af023','2021-02-25','::1',5),(10,'bf5e6db6c5964302ab7c07b8e4dddc5b','2021-03-07','::1',6),(11,'75e479218425b0b81ebd077a06b7fae3','2021-03-07','::1',1),(12,'88e7e31fa26bd5c38e2fd17e1afcce14','2021-03-07','::1',8),(13,'16bce612057eaff291bb4037368ad474','2021-03-08','::1',8),(14,'588628c14f4c56649220c456b933854e','2021-03-08','::1',8),(15,'7775bd4790f34cfc721dc72cfa1a746e','2021-03-08','::1',8),(16,'871ab5f9dc5d5562419b0d2e4a48b6a9','2021-03-08','::1',8),(17,'5cb73aa06335a7d8c775f136bfac0686','2021-03-08','::1',8),(18,'9dad15a9b17ba4899bfa9ca883ec9d2f','2021-03-08','::1',8),(19,'be289e81d8a6033e5e03480784fd39cc','2021-03-08','::1',9),(20,'39610c19cd83e5bc05dbdcf43c4d047e','2021-03-08','::1',9),(21,'08518db3c715177e0278990738afcb53','2021-03-08','::1',9),(22,'00e295c108a26c4c34039a210714d243','2021-03-08','::1',9),(23,'2c97d61dbf226be555ae3c4276d3820c','2021-03-08','::1',9),(24,'0c203a3d02b383c648750dc3e7e1f46b','2021-03-08','::1',9),(25,'1248017fdf9c727f7c2b23dd9c20bcc8','2021-03-08','::1',9),(26,'f58ec5826857a8e26d7cc83b6b692ae7','2021-03-08','::1',8),(27,'b71c57e28a81a8a4c83da2cbb5a8fe96','2021-03-08','::1',8),(28,'213d2d047d87c01e526c30f06220972f','2021-03-08','::1',9),(29,'d9508bbb4725f047ca203d26ade2591b','2021-03-08','::1',1),(30,'24e1efb6c75149280cad3bc5ab485da3','2021-03-08','::1',1),(31,'97e1b07f672feff78c5f30417114a9d5','2021-03-08','::1',1),(32,'f3e9d24b3aa44dee054be849166b909b','2021-03-08','::1',1),(33,'ab6859ccae69920347d5c23bd81310f1','2021-03-08','::1',9),(34,'36224b43e15f82f1ac64005da39b8eed','2021-03-08','::1',9),(35,'04cf051e78163c4029b768c8f420db66','2021-03-08','::1',9),(36,'ef23f7b58357767fe9da8a69ba72dedb','2021-03-08','::1',9),(37,'31003386f898b40abf516a0eb98770ff','2021-03-08','::1',1),(38,'2727810c3f60b728c23cfbc30fddf48f','2021-03-08','::1',9),(39,'c97702c83c1fa9d5458c2c6251261402','2021-03-08','::1',9),(40,'e35f1bd85cb846635e2d7b01f61a10d6','2021-03-08','::1',9),(41,'a518ef88d6263585c4e543e1b75752b7','2021-03-08','::1',9),(42,'6bb848f0fe34078e5eab6b81541201dd','2021-03-08','::1',9),(43,'94beb682578a59624a69701c2afd7eee','2021-03-08','::1',9),(44,'c151e510337bd032c6bee225d8a0f55f','2021-03-08','::1',9),(45,'6c83348130875a639ae4644e9f2018de','2021-03-08','::1',9),(46,'8822c1187122aff01a293ce79e36664b','2021-03-08','::1',9),(47,'55fb64bc1497ebe7fa52ef2b77587888','2021-03-08','::1',9),(48,'cdd88552187720e1ddc8d41f5a9f8721','2021-03-08','::1',9),(49,'104e265d3f8319532cbae4f85d6917bd','2021-03-08','::1',8),(50,'ac8f6f08e253ec71ac4db2c4810443b0','2021-03-08','::1',1),(51,'5e93375f914471242e176fa9b936cff4','2021-03-08','::1',1),(52,'1aeea456e0c7d51e8e4960825ee1e63b','2021-03-08','::1',1),(53,'2cbb58964f07f3e9859e309db29c0485','2021-03-08','::1',1),(54,'a5538ea82731068f334300fd1f517cb3','2021-03-08','::1',1),(55,'207261b4690701568665dd028f272682','2021-03-08','::1',1),(56,'46ce836d7de967564da7b0f190677974','2021-03-08','::1',1),(57,'f82845d4172bc534dba1c5e498954431','2021-03-08','::1',1),(58,'64d91e133efdffcdade30b65cdfc5bf9','2021-03-08','::1',1),(59,'7161bc1e16e8c7cd7f59b8a6cfa770c7','2021-03-08','::1',1),(60,'0a037e38f3040682cd15c766ce3c69c4','2021-03-08','::1',1),(61,'ed7ebb9ddb70487bd37bbb689ea2fcad','2021-03-08','::1',1),(62,'5706d4d0ef2c1923353374c2c53ee40e','2021-03-08','::1',1),(63,'d4de34b9b3847785f24f756320e9b58b','2021-03-08','::1',1),(64,'f30a5a8c2fd9f9475791593c041e667a','2021-03-08','::1',8),(65,'f8c95164d62fdeb45468ca620f8112c1','2021-03-09','::1',1),(66,'cb4c6eae8f4ed0468b0827dbd58ec544','2021-03-09','::1',1),(67,'92fba733d491d08e5ae5e822d42774d6','2021-03-09','::1',1),(68,'82b5f2ec3b85f86dddd9492e0e6aeb3e','2021-03-09','::1',1),(69,'a21a9a412e81ca55cb333003f32fc114','2021-03-09','::1',1),(70,'4fa493804872a47f3cace11a1398c840','2021-03-09','::1',1),(71,'a1fd2c3f367d01f0aa58b980d1901265','2021-03-09','::1',1),(72,'47d9f1a4b36804824f77cb0ca8f3e135','2021-03-09','::1',1),(73,'0fb0d1ac979e89973b31bfd9153eb9bb','2021-03-09','::1',1),(74,'5ec66405f0d33bdba2e9529f152abcb5','2021-03-09','::1',1),(75,'fdb43eedb32ccaab17f27b1453e10d8d','2021-03-09','::1',1),(76,'e2d437c9e3352f4563d5e99a83e694af','2021-03-09','::1',1),(77,'1982340d09acda0d5a4d0d077f486ae7','2021-03-09','::1',8),(78,'059689de4c0eff0c563c639261efca48','2021-03-09','::1',1),(79,'5297f024aac5e0552c949f540e76279d','2021-03-09','::1',1),(80,'ad6497e8fee6d3bee1bfa0e0190c9d13','2021-03-09','::1',8),(81,'e6b3abc07a3a1c4f608d1cab2b265840','2021-03-09','::1',1),(82,'767c41dcb36c2dd26d569a55d3f7c209','2021-03-09','::1',8),(83,'60bcf16b289507a30ebe5326ba9e344e','2021-03-09','::1',8),(84,'f848ec6eef42b371786cc2d892e59158','2021-03-18','::1',29),(85,'82674837658057d637108cb2f62a0183','2021-03-18','::1',29),(86,'60e23cddf0091659aca6a6741e6eeeda','2021-03-18','::1',8),(87,'7c554a259692edd40d78ac689b5799b9','2021-03-18','::1',8),(88,'de35ef43f5d5daf857349c0b919e0823','2021-03-18','::1',8),(89,'30274893513aeb7456093c798528cc99','2021-03-18','::1',8),(90,'0350fde2a525075422970355dcd7f92e','2021-03-18','::1',8),(91,'00fd3fe28a3b66695795681199c24625','2021-03-20','::1',8),(92,'e24f566e5f6916c320252b2b9a2a2518','2021-03-20','::1',8),(93,'61aef5424a8e1c518d23ecdaffe124ca','2021-03-23','::1',8),(94,'4a2b71a405a8f378f9fbc945a6eab290','2021-03-23','::1',8),(95,'ef0fe29e4e1b5cb8b3710972437e5bae','2021-03-30','::1',8),(96,'9fea73b3c8d9b8b7bd63f1ee09202274','2021-03-31','::1',8),(97,'686d50123a1ee2ea397d88a7dc10f77f','2021-04-03','::1',30);
/*!40000 ALTER TABLE `user_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(64) NOT NULL,
  `doj` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dob` date DEFAULT NULL,
  `gender` int NOT NULL,
  `profile_pic` varchar(50) NOT NULL,
  `cover_pic` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

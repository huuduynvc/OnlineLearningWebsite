-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: elearning
-- ------------------------------------------------------
-- Server version	5.7.28-log

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
-- Table structure for table `apply_teacher`
--

DROP TABLE IF EXISTS `apply_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apply_teacher` (
  `id` int(11) NOT NULL,
  `info` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apply_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apply_teacher`
--

LOCK TABLES `apply_teacher` WRITE;
/*!40000 ALTER TABLE `apply_teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `apply_teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_parent` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`),
  FULLTEXT KEY `name_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (2,'Công nghệ thông tin',0,NULL),(3,'Lập trình web',2,'/web'),(4,'Lập trình thiết bị di động',2,'/mobile'),(8,'Âm nhạc',0,''),(9,'Nhạc cụ',8,'/instrument'),(10,'Ngoại ngữ',0,''),(11,'Tiếng Anh',10,'/english'),(12,'Tiếng Pháp',10,'/french'),(13,'Luyện thanh',8,'/vocal'),(15,'Lập trình window',2,'/window');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'Chương 1: Mở đầu',1),(2,'Chương 2: Kiến thức cơ bản',1),(3,'Chương 3: Kiến thức nâng cao',1),(4,'Chương 4: Bài tập áp dụng',1),(5,'Chương 5: Tổng kết',1),(6,'Chương 1: Mở đầu',2),(7,'Chương 2: Kiến thức cơ bản',2),(8,'Chương 3: Kiến thức nâng cao',2),(9,'Chương 4: Bài tập áp dụng',2),(10,'Chương 5: Tổng kết',2),(11,'Chương 1: Mở đầu',3),(12,'Chương 2: Kiến thức cơ bản',3),(13,'Chương 3: Kiến thức nâng cao',3),(14,'Chương 4: Bài tập áp dụng',3),(15,'Chương 5: Tổng kết',3),(17,'Chương 6: Project thực tế',1),(18,'Chương 1: Giới thiệu khóa học',4),(19,'Chương 2: Ôn tâp kiến thức cơ bản',4),(20,'Chương 3: Lý thuyết khóa học',4),(21,'Chương 4: Bài tâp thực hành',4),(23,'Chương 2: Ôn tâp kiến thức cơ bản',30),(28,'Chương 1: Giới thiệu khóa học',36);
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `price` int(11) DEFAULT NULL,
  `offer` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `status` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  `view` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `iscomplete` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`,`description`),
  FULLTEXT KEY `name_2` (`name`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Lập trình PHP cơ bản',299000,10,'2020-12-29 04:06:37','2021-01-01 00:54:56','<p>456</p>',1,3,129,'1.jpg',NULL,0),(2,'Lập trình Web cơ bản ',200000,0,'2020-07-29 19:07:52','2020-07-29 19:07:52','Lập trình web cơ bản ',1,3,57,'2.jpg',NULL,0),(3,'Lập trình Java ',199000,10,'2020-07-30 19:07:52','2020-07-30 19:07:52','Lập trình Java ',1,4,100,'3.jpg',NULL,0),(4,'Lập trình Kotlin ',300000,15,'2020-08-01 19:07:52','2020-08-01 19:07:52','Lập trình Kotlin ',1,4,73,'4.jpg',NULL,0),(5,'Lập trình Javascript ',299000,10,'2020-08-02 19:07:52','2020-08-02 19:07:52','Lập trình Javascript ',1,3,4,'5.jpg',NULL,0),(6,'Lập trình Frontend ',499000,10,'2020-08-02 20:07:52','2020-08-02 20:07:52','Lập trình Frontend ',1,3,80,'6.jpg',NULL,0),(7,'Lập trình Android ',399000,30,'2020-08-02 10:07:52','2020-08-02 10:07:52','Lập trình Android ',1,4,NULL,'7.jpg',NULL,0),(8,'Lập trình iOS ',399000,30,'2020-08-02 11:07:52','2020-08-02 11:07:52','Lập trình iOS ',1,4,90,'8.jpg',NULL,0),(9,'Thiết kế website WordPress chuẩn SEO ',299000,10,'2020-08-03 11:07:52','2020-08-03 11:07:52','Thiết kế website WordPress chuẩn SEO',1,3,8,'9.jpg',NULL,0),(10,'All in one, html/css3, bootstrap 4 và học cắt web từ file thiết kế qua 20 bài tập thực tế',399000,0,'2020-08-04 11:07:52','2020-08-04 11:07:52','All in one, html/css3, bootstrap 4 và học cắt web từ file thiết kế qua 20 bài tập thực tế',1,3,NULL,'10.jpg',NULL,0),(11,'Luyện thi TOEIC new format mục tiêu 450-750+',450000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Luyện thi TOEIC new format mục tiêu 450-750+',1,11,NULL,'11.jpg',NULL,0),(12,'Tiếng Pháp cơ bản cấp độ 1',350000,25,'2020-08-04 11:07:52','2020-08-04 11:07:52','Tiếng Pháp cơ bản cấp độ 1',1,12,120,'12.jpg',NULL,0),(13,'Học guitar đệm hát cấp tốc trong 30 ngày',250000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Học guitar đệm hát cấp tốc trong 30 ngày',1,9,NULL,'13.jpg',NULL,0),(14,'Chinh phục Beatbox trong 30 ngày',250000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Chinh phục Beatbox trong 30 ngày',1,13,124,'14.jpg',NULL,0),(29,'Lập trình java nâng cao',200000,10,'2020-12-28 08:06:32','2020-12-28 08:06:32','<p><strong>Lập tr&igrave;nh java n&acirc;ng cao</strong></p>',1,4,NULL,'29.jpg',NULL,0),(30,'Lập trình web nâng cao',250000,20,'2020-12-28 16:36:02','2020-12-29 09:57:21','<p>Kh&oacute;a học lập tr&igrave;nh web n&acirc;ng cao</p>',1,3,NULL,'30.jpg',NULL,0),(36,'Lập trình C# trong 5 tuần - Cơ bản',599000,50,'2021-01-01 02:09:12','2021-01-01 03:58:00','<div class=\"overall-description\">\r\n<div class=\"description-details\">\r\n<div class=\"des-partial\">\r\n<p>Kh&oacute;a học lập tr&igrave;nh C# trong 5 tuần cung cấp những c&ocirc;ng cụ, framework mới nh&acirc;́t v&ecirc;̀ ng&ocirc;n ngữ l&acirc;̣p tr&igrave;nh C# (từ định nghĩa đ&ecirc;́n ki&ecirc;̉u dữ li&ecirc;̣u, bi&ecirc;́n, c&acirc;u l&ecirc;̣nh, mảng, chu&ocirc;̃i ... c&acirc;́u tr&uacute;c đi&ecirc;̀u khi&ecirc;̉n trong C#, phương thức, lớp....). Học vi&ecirc;n c&oacute; cơ hội thực h&agrave;nh v&agrave; sử dụng thuần thục c&aacute;c control khi thiết kế giao diện; xử l&yacute; chuỗi, mảng, collections v&agrave; c&oacute; khả năng gỡ lỗi v&agrave; kiểm so&aacute;t biệt lệ.</p>\r\n</div>\r\n</div>\r\n</div>\r\n<div class=\"course-benefits\">\r\n<div class=\"benefit-title\"><strong>Lợi &iacute;ch từ kho&aacute; học</strong></div>\r\n<div class=\"benefit-items\">\r\n<div class=\"benefit-item\">\r\n<div class=\"benefit-term\">C&oacute; được kiến thức to&agrave;n diện về ng&ocirc;n ngữ lập tr&igrave;nh C#.</div>\r\n</div>\r\n<div class=\"benefit-item\">\r\n<div class=\"benefit-term\">C&oacute; khả năng ph&aacute;t triển phần mềm ứng dụng bằng C#.</div>\r\n</div>\r\n<div class=\"benefit-item\">\r\n<div class=\"benefit-term\">L&agrave; cơ sở để lập tr&igrave;nh di động đa nền tảng với Xamarin.</div>\r\n</div>\r\n<div class=\"benefit-item\">\r\n<div class=\"benefit-term\">L&agrave; nền tảng để tiếp tục học tương t&aacute;c cơ sở dữ liệu với ADO.NET, LINQ, WPF.</div>\r\n<div class=\"benefit-term\">&nbsp;</div>\r\n</div>\r\n</div>\r\n</div>\r\n<div class=\"course-good-for-area\">\r\n<div class=\"title\"><strong>Ph&ugrave; hợp với</strong></div>\r\n<div class=\"item\"><span class=\"term\">Bất cứ ai muốn học lập tr&igrave;nh ứng dụng C#.</span></div>\r\n<div class=\"item\"><span class=\"term\">Những người chưa biết g&igrave;, y&ecirc;u th&iacute;ch lĩnh vực lập tr&igrave;nh C#.</span></div>\r\n<div class=\"item\"><span class=\"term\">Sinh vi&ecirc;n kh&ocirc;ng học c&ocirc;ng nghệ th&ocirc;ng tin muốn học lập tr&igrave;nh cơ bản để t&igrave;m cơ hội việc l&agrave;m kh&aacute;c trong lĩnh vực c&ocirc;ng nghệ th&ocirc;ng tin.</span></div>\r\n</div>',1,15,NULL,'36.jpg','',0);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_teacher`
--

DROP TABLE IF EXISTS `course_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_teacher` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_teacher`
--

LOCK TABLES `course_teacher` WRITE;
/*!40000 ALTER TABLE `course_teacher` DISABLE KEYS */;
INSERT INTO `course_teacher` VALUES (1,3,9),(2,4,10),(3,4,6),(4,3,6),(5,3,10),(6,3,7),(7,3,1),(9,1,36);
/*!40000 ALTER TABLE `course_teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enroll_course`
--

DROP TABLE IF EXISTS `enroll_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enroll_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  `enroll_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enroll_course`
--

LOCK TABLES `enroll_course` WRITE;
/*!40000 ALTER TABLE `enroll_course` DISABLE KEYS */;
INSERT INTO `enroll_course` VALUES (1,2,1,'2020-12-06 19:07:52',1),(2,2,2,'2020-12-03 19:07:52',1),(3,1,2,'2020-05-03 19:07:52',1),(4,3,2,'2020-12-03 19:07:52',1),(5,1,5,'2020-12-22 19:07:52',1),(6,1,7,'2020-12-22 19:07:52',1),(7,2,7,'2020-12-04 19:07:52',1),(8,3,3,'2020-12-04 19:07:52',1),(9,4,11,'2020-12-04 19:07:52',1),(10,4,12,'2020-12-22 19:07:52',1),(11,4,13,'2020-12-04 19:07:52',1),(12,4,14,'2020-12-22 19:07:52',1);
/*!40000 ALTER TABLE `enroll_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  `comment` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `rating` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,2,9,'Amazing goodjob em',5,'2020-08-02 20:07:52','2020-08-02 20:07:52',1),(2,3,10,'Very good',4,'2020-08-03 20:07:52','2020-08-03 20:07:52',1),(3,4,6,'Tuyệt vời',5,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(4,2,6,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(5,2,7,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(6,2,10,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(7,1,6,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(8,2,5,'Good',3,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(9,1,1,'Good',5,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(10,1,1,'Khóa học rất hay',4,'2020-12-25 16:07:28','2020-12-25 16:07:28',1),(12,1,1,'Bài tập hơi ít',3,'2020-12-25 16:07:28','2020-12-25 16:07:28',1),(13,1,1,'Tệ',1,'2020-12-25 16:07:28','2020-12-25 16:07:28',1),(15,1,1,'Tệ',5,'2020-12-25 16:07:28','2020-12-25 16:07:28',1),(18,3,3,'Good',5,'2020-12-26 05:54:44','2020-12-26 05:54:44',1),(19,3,4,'Hay lắm',4,'2020-12-26 05:54:44','2020-12-26 05:54:44',1),(20,2,8,'good',5,'2020-12-26 05:54:44','2020-12-26 05:54:44',1),(21,34,12,'Good',5,'2020-12-26 05:54:44','2020-12-26 05:54:44',1),(22,34,14,'Good',5,'2020-12-26 05:54:44','2020-12-26 05:54:44',1);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `video` varchar(255) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `id_chapter` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'Bài 1: Giới thiệu khóa học','<p>Giới thiệu kh&oacute;a học 1</p>',NULL,'2020-11-28 19:07:52','2020-12-29 07:18:07',1,1),(2,'Bài 2: Cài đặt phần mềm cần thiết','Cài đặt phần mềm cần thiết',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',1,1),(3,'Bài 3: Ôn tập kiến thức cơ bản','Ôn tập kiến thức cơ bản',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',2,1),(4,'Bài 4: Giới thiệu kiến thức mới','Giới thiệu kiến thức mới',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',2,1),(5,'Bài 1: Giới thiệu khóa học và cách học hiệu quả','<p>Giới thiệu kh&oacute;a học v&agrave; c&aacute;ch học hiệu quả</p>',NULL,'2020-12-28 16:04:13','2020-12-28 16:04:13',18,1),(6,'Bài 1: Giới thiệu khóa học và cách học hiệu quả','<p>Giới thiệu kh&oacute;a học v&agrave; c&aacute;ch học hiệu quả</p>',NULL,'2020-12-28 16:37:03','2020-12-28 16:37:03',23,1),(12,'Bài 1: Giới thiệu khóa học và cách học hiệu quả','<p>Giới thiệu kh&oacute;a học v&agrave; c&aacute;ch học hiệu quả</p>',NULL,'2021-01-01 02:10:12','2021-01-01 02:10:12',28,1);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `info` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `status` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'<p>abc</p>',1),(3,' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',1),(4,'Teacher Nguyễn Văn Diện',1);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` int(1) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nguyễn Hữu Duy','0369439969','nguyenhuuduy@gmail.com','huuduy','$2a$10$q/2pNU9r9XoS5KHpfl7hEu47xMnwYiCc3UKgwLFeV06/xmjL0IEPC',2,'2020-12-29 10:34:22','2020-12-29 12:32:27',1,'1.jpg'),(2,'Ngọc Minh Duy','0961509619','minhduy3110@gmail.com','nmd30cm','$2a$10$q/2pNU9r9XoS5KHpfl7hEu47xMnwYiCc3UKgwLFeV06/xmjL0IEPC',2,'2020-07-28 19:07:52','2020-07-28 19:07:52',1,'2.jpg'),(3,'Trần Vũ Công','0281516887','maydapdaklak@gmail.com','trancong1','$2a$10$q/2pNU9r9XoS5KHpfl7hEu47xMnwYiCc3UKgwLFeV06/xmjL0IEPC',2,'2020-12-29 10:34:08','2020-12-29 11:12:59',1,'3.jpg'),(4,'Nguyễn Văn Diện','0966028215','vandien3103@gmail.com','vandien99','$2a$10$q/2pNU9r9XoS5KHpfl7hEu47xMnwYiCc3UKgwLFeV06/xmjL0IEPC',2,'2020-07-28 19:07:52','2020-07-28 19:07:52',1,'4.jpg'),(34,'admin4','0369439969','admin4@gmail.com','admin4','$2a$10$q/2pNU9r9XoS5KHpfl7hEu47xMnwYiCc3UKgwLFeV06/xmjL0IEPC',3,'2020-07-28 19:07:52','2020-07-28 19:07:52',1,'34.jpg'),(37,'Administration','0396993690','admin.rekdu@gmail.com','admin','$2a$10$oBEbkh5CVWBbVj9JSldO8OzbGfOzbkCcTDsLrJrKkXkOjCymfVmzi',3,'2020-12-29 17:10:03','2020-12-29 17:10:03',1,NULL),(78,'Hải','01234567890','hai@gmail.com','haimtp','$2a$10$YQUh.7VTZgpuSBURX53nVePyd8R6JphcOk7nruZNk9b91U7YJe0qK',1,'2020-12-31 15:27:13','2020-12-31 15:27:13',1,NULL),(92,'Hải','0123456789','hai1@gmail.com','haimtp1','$2a$10$tH9yj8AQ7iI0TQG5JjNe7eARXgqsQdZFvGBNmxNN/TgE6kri1Jqja',1,'2020-12-31 16:16:00','2020-12-31 16:16:00',1,NULL),(93,'Nguyễn Quốc Hải','0123456785','haibanh456@gmail.com','haibanh456','$2a$10$G4d.nyBJZe0lLjOPSyeJMOkXdWroLwSnj3ndPH989uBuiOoRb3Dv6',1,'2021-01-01 00:06:59','2021-01-01 00:06:59',1,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-01  4:40:14

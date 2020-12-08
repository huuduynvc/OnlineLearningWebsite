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
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apply_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apply_teacher`
--

LOCK TABLES `apply_teacher` WRITE;
/*!40000 ALTER TABLE `apply_teacher` DISABLE KEYS */;
INSERT INTO `apply_teacher` VALUES (1,'nguyenhuuduy2011@gmail.com','2020-07-28 19:07:52'),(2,'ngocminhduy@gmail.com','2020-07-29 19:07:52');
/*!40000 ALTER TABLE `apply_teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_parent` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Danh mục',0,NULL),(2,'Công nghệ thông tin',1,NULL),(3,'Lập trình web',2,'/web'),(4,'Lập trình thiết bị di động',2,'/mobile'),(5,'Khóa học',0,'/course'),(6,'Trở thành giảng viên',0,'/tutor'),(7,'Về chúng tôi',0,'/about'),(8,'Âm nhạc',1,''),(9,'Nhạc cụ',8,'/instrument'),(10,'Ngoại ngữ',1,''),(11,'Tiếng Anh',10,'/english'),(12,'Tiếng Pháp',10,'/french'),(13,'Luyện thanh',8,'/vocal');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapter` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_course` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CHAPTER_COURSE_idx` (`id_course`),
  CONSTRAINT `FK_CHAPTER_COURSE` FOREIGN KEY (`id_course`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'Chương 1: Mở đầu',1),(2,'Chương 2: Kiến thức cơ bản',1),(3,'Chương 3: Kiến thức nâng cao',1),(4,'Chương 4: Bài tập áp dụng',1),(5,'Chương 5: Tổng kết',1),(6,'Chương 1: Mở đầu',2),(7,'Chương 2: Kiến thức cơ bản',2),(8,'Chương 3: Kiến thức nâng cao',2),(9,'Chương 4: Bài tập áp dụng',2),(10,'Chương 5: Tổng kết',2),(11,'Chương 1: Mở đầu',3),(12,'Chương 2: Kiến thức cơ bản',3),(13,'Chương 3: Kiến thức nâng cao',3),(14,'Chương 4: Bài tập áp dụng',3),(15,'Chương 5: Tổng kết',3);
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `offer` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `status` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_COURSE_CATEGORY_idx` (`id_category`),
  CONSTRAINT `FK_COURSE_CATEGORY` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Lập trình PHP cơ bản',NULL,199000,0,'2020-07-28 19:07:52','2020-07-28 19:07:52','Khoá học cung cấp cho học viên đầy đủ các kỹ năng lập trình php căn bản thông qua các ví dụ để học viên có thể thực hành theo và ứng dụng vào thực tế. Điểm khác biệt của khóa học là nội dung đầy đủ, thực hành chi tiết, cung cấp đủ thời lượng để bạn có thể hiểu được bản chất của việc lập trình PHP cơ bản Lộ trình học tập: Khóa học cơ bản gồm 2 phần: + Phần một là lý thuyết cơ bản về ngôn ngữ PHP + Phần hai là học thực hành để hiểu bản chất, ứng dụng thực tế',1,3),(2,'Lập trình Web cơ bản ',NULL,200000,0,'2020-07-29 19:07:52','2020-07-29 19:07:52','Lập trình web cơ bản ',1,3),(3,'Lập trình Java ',NULL,199000,10,'2020-07-30 19:07:52','2020-07-30 19:07:52','Lập trình Java ',1,4),(4,'Lập trình Kotlin ',NULL,300000,15,'2020-08-01 19:07:52','2020-08-01 19:07:52','Lập trình Kotlin ',1,4),(5,'Lập trình Javascript ',NULL,299000,10,'2020-08-02 19:07:52','2020-08-02 19:07:52','Lập trình Javascript ',1,3),(6,'Lập trình Frontend ',NULL,499000,10,'2020-08-02 20:07:52','2020-08-02 20:07:52','Lập trình Frontend ',1,3),(7,'Lập trình Android ',NULL,399000,30,'2020-08-02 10:07:52','2020-08-02 10:07:52','Lập trình Android ',1,4),(8,'Lập trình iOS ',NULL,399000,30,'2020-08-02 11:07:52','2020-08-02 11:07:52','Lập trình iOS ',1,4),(9,'Thiết kế website WordPress chuẩn SEO ',NULL,299000,10,'2020-08-03 11:07:52','2020-08-03 11:07:52','Thiết kế website WordPress chuẩn SEO',1,3),(10,'All in one, html/css3, bootstrap 4 và học cắt web từ file thiết kế qua 20 bài tập thực tế',NULL,399000,0,'2020-08-04 11:07:52','2020-08-04 11:07:52','All in one, html/css3, bootstrap 4 và học cắt web từ file thiết kế qua 20 bài tập thực tế',1,3),(11,'Luyện thi TOEIC new format mục tiêu 450-750+',NULL,450000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Luyện thi TOEIC new format mục tiêu 450-750+',1,11),(12,'Tiếng Pháp cơ bản cấp độ 1',NULL,350000,25,'2020-08-04 11:07:52','2020-08-04 11:07:52','Tiếng Pháp cơ bản cấp độ 1',1,12),(13,'Học guitar đệm hát cấp tốc trong 30 ngày',NULL,250000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Học guitar đệm hát cấp tốc trong 30 ngày',1,9),(14,'Chinh phục Beatbox trong 30 ngày',NULL,250000,10,'2020-08-04 11:07:52','2020-08-04 11:07:52','Chinh phục Beatbox trong 30 ngày',1,13);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_teacher`
--

DROP TABLE IF EXISTS `course_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_teacher` (
  `id` int(11) NOT NULL,
  `id_teacher` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CT_COURSE_idx` (`id_course`),
  KEY `FK_CT_TEACHER_idx` (`id_teacher`),
  CONSTRAINT `FK_CT_COURSE` FOREIGN KEY (`id_course`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_CT_TEACHER` FOREIGN KEY (`id_teacher`) REFERENCES `teacher` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_teacher`
--

LOCK TABLES `course_teacher` WRITE;
/*!40000 ALTER TABLE `course_teacher` DISABLE KEYS */;
INSERT INTO `course_teacher` VALUES (1,3,9),(2,4,10),(3,4,6),(4,3,6),(5,3,10),(6,3,7);
/*!40000 ALTER TABLE `course_teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enroll_course`
--

DROP TABLE IF EXISTS `enroll_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enroll_course` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  `enroll_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ENROLL_USER_idx` (`id_user`),
  KEY `FK_ENROLL_COURSE_idx` (`id_course`),
  CONSTRAINT `FK_ENROLL_COURSE` FOREIGN KEY (`id_course`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ENROLL_USER` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enroll_course`
--

LOCK TABLES `enroll_course` WRITE;
/*!40000 ALTER TABLE `enroll_course` DISABLE KEYS */;
INSERT INTO `enroll_course` VALUES (1,2,1,'2020-12-06 19:07:52',1),(2,2,2,'2020-12-03 19:07:52',1),(3,1,2,'2020-05-03 19:07:52',1),(4,3,2,'2020-12-03 19:07:52',1),(5,1,5,'2020-12-03 19:07:52',1),(6,1,7,'2020-05-03 19:07:52',1),(7,2,7,'2020-12-04 19:07:52',1),(8,3,3,'2020-12-04 19:07:52',1),(9,4,11,'2020-12-04 19:07:52',1),(10,4,12,'2020-12-04 19:07:52',1),(11,4,13,'2020-12-04 19:07:52',1),(12,4,14,'2020-12-04 19:07:52',1);
/*!40000 ALTER TABLE `enroll_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  `comment` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `rating` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_FEEDBACK_USER_idx` (`id_user`),
  KEY `FK_FEEDBACK_COURSE_idx` (`id_course`),
  CONSTRAINT `FK_FEEDBACK_COURSE` FOREIGN KEY (`id_course`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_FEEDBACK_USER` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,2,9,'Amazing goodjob em',5,'2020-08-02 20:07:52','2020-08-02 20:07:52',1),(2,3,10,'Very good',4,'2020-08-03 20:07:52','2020-08-03 20:07:52',1),(3,4,6,'Tuyệt vời',5,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(4,2,6,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(5,2,7,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(6,2,10,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1),(7,1,6,'Bad',1,'2020-08-04 20:07:52','2020-08-04 20:07:52',1);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `video` varchar(255) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `id_chapter` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_LESSON_CHAPTER_idx` (`id_chapter`),
  CONSTRAINT `FK_LESSON_CHAPTER` FOREIGN KEY (`id_chapter`) REFERENCES `chapter` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'Bài 1: Giới thiệu khóa học','Giới thiệu khóa học',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',1,1),(2,'Bài 2: Cài đặt phần mềm cần thiết','Cài đặt phần mềm cần thiết',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',1,1),(3,'Bài 3: Ôn tập kiến thức cơ bản','Ôn tập kiến thức cơ bản',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',2,1),(4,'Bài 4: Giới thiệu kiến thức mới','Giới thiệu kiến thức mới',NULL,'2020-11-28 19:07:52','2020-11-28 19:07:52',2,1);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int(11) NOT NULL,
  `info` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_TEACHER_USER` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (3,'Teacher Trần Vũ Công'),(4,'Teacher Nguyễn Văn Diện');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthday` varchar(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` int(1) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `modification_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nguyễn Hữu Duy','20-11-1999','0369439969','nguyenhuuduynvc@gmail.com','huuduynvc','123',1,'2020-07-28 19:07:52','2020-07-28 19:07:52',1),(2,'Ngọc Minh Duy','31-10-1999','0961509619','minhduy3110@gmail.com','nmd30cm','123',2,'2020-07-28 19:07:52','2020-07-28 19:07:52',1),(3,'Trần Vũ Công','06-09-1999','0281516886','maydapdaklak@gmail.com','trancong','123',3,'2020-07-28 19:07:52','2020-07-28 19:07:52',1),(4,'Nguyễn Văn Diện','31-03-1999','0966028215','vandien3103@gmail.com','vandien99','123',3,'2020-07-28 19:07:52','2020-07-28 19:07:52',1);
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

-- Dump completed on 2020-12-08 10:56:33

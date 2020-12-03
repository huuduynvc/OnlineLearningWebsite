CREATE DATABASE DA_WEB;
GO
USE DA_WEB;
GO
CREATE TABLE [User](
	UserID smallint identity(1,1) primary key,
	FullName varchar(20),
	Birthday datetime,
	PhoneNumber float,
	Email varchar(30),
	Username varchar(30),
	Password_User varchar(30),
	Role_User varchar(30),
	CreateDate datetime,
	status_User int,
);

GO
CREATE TABLE [EnrollInCourse](
	UserID smallint identity(1,1) primary key,
	IDCourse smallint,
	EnrollDate datetime,
	createtime datetime,
	status_Enroll int,
);

CREATE TABLE [lesson](
	LessonID smallint identity(1,1) primary key,
	LessonName varchar(30),
	Content varchar(30),
	Video varchar(20),
	CreateDate datetime,
	status_Lesson int,
);

CREATE TABLE [Course](
	IDCourse smallint identity(1,1) primary key,
	IDImage smallint ,
	Tuition float,
	Offer float,
	TeacherID smallint,
	UploadDate datetime,
	IDTeacherUpload smallint,
	IDCategory smallint,
	status_Course int,
);

CREATE TABLE [Category](
	IDCategory smallint identity(1,1) primary key,
	NameCategory varchar(20),
	IDParent smallint,
);

CREATE TABLE [Feedback](
	IDFeedback smallint identity(1,1) primary key,
	UserID smallint,
	CourseID smallint,
	Comment varchar(50),
	Rating int,
	CreateDate datetime,
	status_feedback int,
);

CREATE TABLE [Image](
IDImage smallint identity(1,1) primary key,
NameImage varchar(30),
Link varchar(30),
);

CREATE TABLE [Video](
IDVideo smallint identity(1,1) primary key,
NameVideo varchar(30),
Link varchar(30),
LessonID smallint, 
);


CREATE TABLE [Contact](
ContactID smallint identity(1,1) primary key,
EmailContact varchar(30),
);

---tao khoa ngoai
alter table Course add constraint FK_Course_Category foreign key(IDCategory)  references Category(IDCategory);
alter table  EnrollInCourse add constraint FK_EnrollInCourse_Course foreign key(IDCourse)  references Course(IDCourse);

-- insert data
--Table User


INSERT INTO [dbo].[User] ([UserID], [FullName], [Birthday],[PhoneNumber], [Email], [Username],[Password_User],[Role_User],[CreateDate],[status_User])
VALUES 
  (1, N'Nguyen Duc Cuong', '19900517', '09612833012','duccuong@gmail.com','duccuong','12345','Giang Vien','20190517','1')
GO
INSERT INTO [dbo].[User] ([UserID], [FullName], [Birthday],[PhoneNumber], [Email], [Username],[Password_User],[Role_User],[CreateDate],[status_User])
VALUES 
  (2, N'Tran Van Manh', '19890110', '0971235671','TVM@gmail.com','TVM','12345','Giang Vien','20200120','1')
GO
INSERT INTO [dbo].[User] ([UserID], [FullName], [Birthday],[PhoneNumber], [Email], [Username],[Password_User],[Role_User],[CreateDate],[status_User])
VALUES 
  (3, N'Pham Thi Kieu Nu', '19941030', '0986120102','KieuPham@gmail.com','KieuPham','12345','Giang Vien','20200120','1')
GO
INSERT INTO [dbo].[User] ([UserID], [FullName], [Birthday],[PhoneNumber], [Email], [Username],[Password_User],[Role_User],[CreateDate],[status_User])
VALUES 
  (4, N'Nguyen Thi Trang', '19920720', '0986888109','Trangnguyen@gmail.com','Trang nguyen','12345','Giang Vien','20200120','1')
GO
 
 --Table EnrollCourse
 SET IDENTITY_INSERT [dbo].[EnrollInCourse] ON
GO
 INSERT INTO [dbo].[EnrollInCourse] ([UserID], [IDCourse], [EnrollDate],[createtime],[status_Enroll])
VALUES 
  (1, 1, '20200720', '20200510','1')
GO
 INSERT INTO [dbo].[EnrollInCourse] ([UserID], [IDCourse], [EnrollDate],[createtime],[status_Enroll])
VALUES 
  (2, 2, '20200805', '20200510','1')
GO
 INSERT INTO [dbo].[EnrollInCourse] ([UserID], [IDCourse], [EnrollDate],[createtime],[status_Enroll])
VALUES 
  (3, 3, '20201203', '20201102','1')
GO
 INSERT INTO [dbo].[EnrollInCourse] ([UserID], [IDCourse], [EnrollDate],[createtime],[status_Enroll])
VALUES 
  (4, 4, '20201203', '20201201','1')
GO
 SET IDENTITY_INSERT [dbo].[EnrollInCourse] OFF
GO
--Table Lesson
 SET IDENTITY_INSERT [dbo].[lesson] ON
GO
 INSERT INTO [dbo].[lesson] ([LessonID], [LessonName], [Content],[Video],[CreateDate],[status_Lesson])
VALUES 
  (1, N'Lap trinh co ban Web', 'Thiet ke mot trang web ban hang', 'laptrinhweb','20201003','1')
GO
 INSERT INTO [dbo].[lesson] ([LessonID], [LessonName], [Content],[Video],[CreateDate],[status_Lesson])
VALUES 
  (2, N'Lap trinh nang cao Web', 'Khai niem va bai tap vi du', 'laptrinhwebNC','20201102','1')
GO
 INSERT INTO [dbo].[lesson] ([LessonID], [LessonName], [Content],[Video],[CreateDate],[status_Lesson])
VALUES 
  (1, N'Ma Hoa du lieu', 'Bai tap ma hoa nhom', 'ma hoa','20190310','1')
GO
 INSERT INTO [dbo].[lesson] ([LessonID], [LessonName], [Content],[Video],[CreateDate],[status_Lesson])
VALUES 
  (1, N'jQuery', 'Bai tap', 'juery','20200511','1')
GO
 SET IDENTITY_INSERT [dbo].[lesson] OFF
GO
-- table [Course]
 SET IDENTITY_INSERT [dbo].[Course] ON
GO
 INSERT INTO [dbo].[Course] ([IDCourse], [IDImage], [Tuition],[Offer],[TeacherID],[UploadDate],[IDTeacherUpload],[IDCategory],[status_Course])
VALUES 
  (1,1,'500000' ,'1','1', '20200510','1','1','1')
GO
 INSERT INTO [dbo].[Course] ([IDCourse], [IDImage], [Tuition],[Offer],[TeacherID],[UploadDate],[IDTeacherUpload],[IDCategory],[status_Course])
VALUES 
  (2,2,'600000' ,'2','2', '20200331','2','2','1')
GO
 INSERT INTO [dbo].[Course] ([IDCourse], [IDImage], [Tuition],[Offer],[TeacherID],[UploadDate],[IDTeacherUpload],[IDCategory],[status_Course])
VALUES 
  (3,3,'1000000' ,'3','3', '20200110','3','3','1')
GO
 INSERT INTO [dbo].[Course] ([IDCourse], [IDImage], [Tuition],[Offer],[TeacherID],[UploadDate],[IDTeacherUpload],[IDCategory],[status_Course])
VALUES 
  (4,4,'800000' ,'4','4', '20201101','4','4','1')
GO
 SET IDENTITY_INSERT [dbo].[Course] OFF
GO
-- Table [Category]
 SET IDENTITY_INSERT [dbo].[Category] ON
GO
 INSERT INTO [dbo].[Category] ([IDCategory], [NameCategory], [IDParent])
VALUES 
  (1,'Nguyen Thanh Tam', 1)
GO
 INSERT INTO [dbo].[Category] ([IDCategory], [NameCategory], [IDParent])
VALUES 
  (2,'Hoang Phi Long', 2)
GO
 INSERT INTO [dbo].[Category] ([IDCategory], [NameCategory], [IDParent])
VALUES 
  (3,'Do Dinh Son', 3)
GO
 INSERT INTO [dbo].[Category] ([IDCategory], [NameCategory], [IDParent])
VALUES 
  (4,'Nguyen Thi Hien', 4)
GO
 SET IDENTITY_INSERT [dbo].[Category] OFF
GO
-- Table [Feedback]
 SET IDENTITY_INSERT [dbo].[Feedback] ON
GO
 INSERT INTO [dbo].[Feedback] ([IDFeedback], [UserID], [CourseID],[Comment],[CreateDate],[status_feedback])
VALUES 
  (1, 1, 1,'Bai Hoc rat hay va bo ich', '20201201','1')
GO
 INSERT INTO [dbo].[Feedback] ([IDFeedback], [UserID], [CourseID],[Comment],[CreateDate],[status_feedback])
VALUES 
  (2, 2, 2,'Khoa hoc nay tuyet voi', '20201103','1')
GO
 INSERT INTO [dbo].[Feedback] ([IDFeedback], [UserID], [CourseID],[Comment],[CreateDate],[status_feedback])
VALUES 
  (3,3,3,'Toi se hoc tren day lau dai, khoa hoc rat bo ich', '20200801','1')
GO
 INSERT INTO [dbo].[Feedback] ([IDFeedback], [UserID], [CourseID],[Comment],[CreateDate],[status_feedback])
VALUES 
  (4,4,4,'bai hoc rat de hieu cam on thay co', '20200610','1')
GO
 SET IDENTITY_INSERT [dbo].[Feedback] OFF
GO
--Table Image
 SET IDENTITY_INSERT [dbo].[Image] ON
GO
INSERT INTO [dbo].[Image] ([IDImage], [NameImage],[Link])
VALUES 
  (1, 'avt1','D\avt1.jpg')
GO
INSERT INTO [dbo].[Image] ([IDImage], [NameImage],[Link])
VALUES 
  (2, 'avt2','D\avt2.jpg')
GO
INSERT INTO [dbo].[Image] ([IDImage], [NameImage],[Link])
VALUES 
  (3, 'avt3','D\avt3.jpg')
GO
INSERT INTO [dbo].[Image] ([IDImage], [NameImage],[Link])
VALUES 
  (4, 'avt4','D\avt4.jpg')
GO
 SET IDENTITY_INSERT [dbo].[Image] OFF
GO
-- Table video
 SET IDENTITY_INSERT [dbo].[Video] ON
GO
INSERT INTO [dbo].[Video] ([IDVideo], [NameVideo],[Link], [LessonID])
VALUES 
  (1, 'video1','D\video1.mp4',1)
GO
INSERT INTO [dbo].[Video] ([IDVideo], [NameVideo],[Link], [LessonID])
VALUES 
  (2, 'video2','D\video2.mp4',1)
GO

INSERT INTO [dbo].[Video] ([IDVideo], [NameVideo],[Link], [LessonID])
VALUES 
  (3, 'video3','D\video3.mp4',1)
GO

INSERT INTO [dbo].[Video] ([IDVideo], [NameVideo],[Link], [LessonID])
VALUES 
  (4, 'video4','D\video4.mp4',1)
GO
 SET IDENTITY_INSERT [dbo].[Video] OFF
GO
--Table Contact
 SET IDENTITY_INSERT [dbo].[Contact] ON
GO
INSERT INTO [dbo].[Contact] ([ContactID], [EmailContact])
VALUES 
  (1, 'Giaovu@gmail.com')
GO
INSERT INTO [dbo].[Contact] ([ContactID], [EmailContact])
VALUES 
  (2, 'Phongdaotao@gmail.com')
GO
 SET IDENTITY_INSERT [dbo].[Contact] OFF
GO
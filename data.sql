CREATE DATABASE DA_WEB;
GO
USE DA_WEB;
GO
CREATE TABLE [User](
	ID smallint identity(1,1) primary key,
	FullName varchar(20),
	Birthday datetime,
	PhoneNumber float,
	Email varchar(30),
	Username varchar(30),
	Password varchar(30),
	Role varchar(30),
	CreateDate datetime,
	status int,
);
CREATE TABLE [EnrollInCourse](
	UserID smallint identity(1,1) primary key,
	IDCourse  smallint identity(1,1),
	EnrollDate datetime,
	createtime datetime,
	status int,
);
CREATE TABLE [lesson](
	LessonID smallint identity(1,1) primary key,
	LessonName varchar(30),
	Content varchar(30),
	Video varchar(20),
	CreateDate datetime,
	status int,
);
CREATE TABLE [Course](
	CourseID smallint identity(1,1) primary key,
	Image_Courses varchar(50),
	Tuition float,
	Offer float,
	TeacherID smallint identity(1,1),
	UploadDate datetime,
	IDTeacherUpload smallint identity(1,1),
	IDCategory smallint identity(1,1),
	status int,
);
CREATE TABLE [Category](
	DCategory smallint identity(1,1) primary key,
	NameCategory varchar(20),
	IDParent smallint identity(1,1),
);
CREATE TABLE [Feedback](
	IDFeedback smallint identity(1,1) primary key,
	UserID smallint identity(1,1),
	CourseID smallint identity(1,1),
	Comment varchar(30),
	Rating int,
	CreateDate datetime,
	status int,
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
LessonID smallint identity(1,1), 
);

CREATE TABLE [Contact](
ContactID smallint identity(1,1) primary key,
EmailContact varchar(30),
);
alter table TaxiTrip add constraint FK_PULocationID_LoCation  foreign key(PULocationID) references TaxiZone(surrogateLocationID);
alter table TaxiTrip add constraint FK_DOLocationID_LoCation  foreign key(DOLocationID) references TaxiZone(surrogateLocationID);
alter table TaxiTrip add constraint FK_PUTimeID_DateTimeTrip  foreign key(PUTimeID) references [DateTimeTrip](surrogateDateID);
alter table TaxiTrip add constraint FK_DOTimeID_DateTimeTrip  foreign key(DOTimeID) references [DateTimeTrip](surrogateDateID);
alter table TaxiTrip add constraint FK_PUcensusblockID_CensusTract  foreign key(PUCensusBlockID) references [CensusTract](surr_CensusTract);
alter table TaxiTrip add constraint FK_DOcensusblockID_CensusTract  foreign key(DOCensusBlockID) references [CensusTract](surr_CensusTract);
alter table TaxiTrip add constraint FK_VendorID_Vendor  foreign key(VendorID) references Vendor(surrogateVendorID);
alter table TaxiTrip add constraint FK_paymentID_payment_type  foreign key(paymentID) references payment_type(surrogatePaymentID);
alter table TaxiTrip add constraint FK_ratecodeid_ratecode  foreign key(ratecodeid) references rateCode(surrogateRCodeID);
alter table TaxiTrip add constraint FK_extra_Extra_Cost  foreign key(extra) references extra_cost(surrogateExtraID);
alter table TaxiTrip add constraint FK_sourceid_Source  foreign key(sourceid) references [Source](surrogateSourceID);

alter table TaxiZone add constraint FK_TXsourceid_Source  foreign key(sourceid) references [Source](surrogateSourceID);

alter table CensusTract add constraint FK_CTsourceid_Source  foreign key(sourceid) references [Source](surrogateSourceID);

alter table CensusBlock add constraint FK_Censustract_Censustract  foreign key(CensusTract) references CensusTract(surr_CensusTract);

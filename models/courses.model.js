const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from course'),
    single: id => db.load(`select * from course where id = ${id}`),
    add: entity => db.add('course', entity),
    del: id => db.del('course', { id: id }),
    patch: (entity, id) => {
        const condition = { id: id };
        delete entity.primaryAuto;
        return db.patch('course', entity, condition);
    },

    top10Newest: () => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
     avg(f.rating)as rating, count(f.rating) as num_of_rating
    FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
     f on c.id = f.id_course
    group by c.id
    ORDER BY c.creation_date DESC limit 10`),

    pageByCourse: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    avg(f.rating)as rating, count(f.rating) as num_of_rating
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
    limit 6 offset ${offset}`),
    
    orderByPriceAsc:(offset)=> db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
   order by c.price - c.price*c.offer/100 asc
    limit 6 offset ${offset}` ), 

    orderByPriceDesc:(offset)=> db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
   order by c.price - c.price*c.offer/100 desc
    limit 6 offset ${offset}` ), 
    orderByRateAsc:(offset)=> db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
   order by rating asc
    limit 6 offset ${offset}` ), 

    orderByRateDesc:(offset)=> db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
   order by rating desc
    limit 6 offset ${offset}` ), 

    orderByNewCourse:(offset)=> db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
   order by c.creation_date desc
    limit 6 offset ${offset}` ), 

    countCourse: async() => {
        const count = await db.load(`select count(*) as total from course`);
        return count[0].total;
    },

    getChapterByCourseId: id => db.load(`select * from chapter where id_course = ${id}`),
    getLessonByChapterId: id => db.load(`select * from lesson where id_chapter = ${id}`),
    top5CourseOtherMostBuy: (id_course, id_category) => db.load(`SELECT *,count(ec.id_course) as members 
    FROM enroll_course as ec LEFT JOIN course as c ON ec.id_course = c.id
    WHERE ec.id_course != ${id_course} AND c.id_category = ${id_category}
    GROUP BY ec.id_course LIMIT 5`),
    countMemberByCourseID: id => db.load(`SELECT count(id_course) as member 
    FROM enroll_course
    WHERE id_course = ${id}`),
};
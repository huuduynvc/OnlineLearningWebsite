const db = require('../utils/db');

module.exports = {
    add: entity => db.add('course', entity),
    all: () => db.load('select * from course'),
    async single(id) {
        const rows = await db.load(`select * from course where id = ${id}`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    enrollCourse: entity => db.add('enroll_course', entity),
    del: id => db.del('course', { id: id }),
    update: id => db.load(`UPDATE course SET view = view + 1 WHERE id = '${id}'`),
    patch: (entity, id) => {
        const condition = { id: id };
        return db.patch('course', entity, condition);
    },

    delLesson: id => db.del('lesson', { id: id }),
    delChapter: id => db.del('chapter', { id: id }),
    addChapter: entity => db.add('chapter', entity),
    addLesson: entity => db.add('lesson', entity),
    patchChapter: (entity, id) => {
        const condition = { id: id };
        return db.patch('chapter', entity, condition);
    },
    patchLesson: (entity, id) => {
        const condition = { id: id };
        return db.patch('lesson', entity, condition);
    },
    async getChapterById(id) {
        const rows = await db.load(`select * from chapter where id = ${id}`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    async getLessonById(id) {
        const rows = await db.load(`select * from lesson where id = ${id}`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    getCountCourseByCatId: async(id) => {
        let count = await db.load(`select count(c.id) as count
        FROM course c LEFT JOIN category cat on c.id_category=cat.id
        where  c.id_category = ${id}`);
        return count[0].count;
    },

    top10Newest: () => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
     avg(f.rating)as rating, count(f.rating) as num_of_rating
    FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
     f on c.id = f.id_course
    group by c.id
    ORDER BY c.creation_date DESC limit 10`),

    top10Viewest: () => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
     avg(f.rating)as rating, count(f.rating) as num_of_rating
    FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
     f on c.id = f.id_course
    group by c.id
    ORDER BY c.view DESC limit 10`),

    top5Hot: () => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    avg(f.rating) as rating, count(f.rating) as num_of_rating
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
    WHERE c.view >= 50
   group by c.id
   HAVING avg(f.rating) >= 4
   ORDER BY c.view DESC limit 5`),
    //// search have  category and check (sort)
    // asc price
    searchCateCheckPriceASC: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
  order by c.price - c.price*c.offer/100 asc
   limit 6 offset ${offset}`),
    // desc price
    searchCateCheckPriceDESC: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
  order by c.price - c.price*c.offer/100 desc
   limit 6 offset ${offset}`),
    // asc rate
    searchCateCheckRateASC: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
  order by rating asc
   limit 6 offset ${offset}`),
    // desc rate
    searchCateCheckRateDESC: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
  order by rating desc
   limit 6 offset ${offset}`),
    // new course
    searchCateCheckNewCourse: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
  order by c.creation_date desc
   limit 6 offset ${offset}`),
    //// search have  category and not check (sort)
    searchCateNotCheck: (keySearch, idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}') and cat.id_parent = ${idCate}
  group by c.id
   limit 6 offset ${offset}`),
    //// search havn't category and have check (sort)
    // asc price
    searchNotCateCheckPriceASC: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
  group by c.id
  order by c.price - c.price*c.offer/100 asc
   limit 6 offset ${offset}`),
    // desc price
    searchNotCateCheckPriceDESC: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
  group by c.id
  order by c.price - c.price*c.offer/100 desc
   limit 6 offset ${offset}`),
    // asc rate
    searchNotCateCheckRateDESC: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
  group by c.id
  order by rating asc
   limit 6 offset ${offset}`),
    // desc rate
    searchNotCateCheckRateDESC: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
  group by c.id
  order by rating desc
   limit 6 offset ${offset}`),
    // new course
    searchNotCateCheckNewCourse: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
  group by c.id
  order by c.creation_date desc
   limit 6 offset ${offset}`),
    //// search havn't category and havn't check (sort)
    searchNotCateNotCheck: (keySearch, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
    where match(c.name) against('${keySearch}') or match(cat.name) against('${keySearch}')
   group by c.id
    limit 6 offset ${offset}`),
    //////////////////////////////////////////////////////////////////////
    //// not search have  category and check (sort)
    // asc price
    notSearchCateCheckPriceASC: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where  cat.id_parent = ${idCate}
  group by c.id
  order by c.price - c.price*c.offer/100 asc
   limit 6 offset ${offset}`),
    // desc price
    notSearchCateCheckPriceDESC: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where  cat.id_parent = ${idCate}
  group by c.id
  order by c.price - c.price*c.offer/100 desc
   limit 6 offset ${offset}`),
    // asc rate
    notSearchCateCheckRateASC: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where  cat.id_parent = ${idCate}
  group by c.id
  order by rating asc
   limit 6 offset ${offset}`),
    // desc rate
    notSearchCateCheckRateDESC: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where  cat.id_parent = ${idCate}
  group by c.id
  order by rating desc
   limit 6 offset ${offset}`),
    // new course
    notSearchCateCheckNewCourse: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where  cat.id_parent = ${idCate}
  group by c.id
  order by c.creation_date desc
   limit 6 offset ${offset}`),
    //// not search have  category and not check (sort)
    notSearchCateNotCheck: (idCate, offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
   where cat.id_parent = ${idCate}
  group by c.id
   limit 6 offset ${offset}`),
    //// search havn't category and have check (sort)
    // asc price
    notSearchNotCateCheckPriceASC: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
  group by c.id
  order by c.price - c.price*c.offer/100 asc
   limit 6 offset ${offset}`),
    // desc price
    notSearchNotCateCheckPriceDESC: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
  group by c.id
  order by c.price - c.price*c.offer/100 desc
   limit 6 offset ${offset}`),
    // asc rate
    notSearchNotCateCheckRateASC: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
  group by c.id
  order by rating asc
   limit 6 offset ${offset}`),
    // desc rate
    notSearchNotCateCheckRateDESC: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
  group by c.id
  order by rating desc
   limit 6 offset ${offset}`),
    // new course
    notSearchNotCateCheckNewCourse: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
   round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
  FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
   f on c.id = f.id_course
  group by c.id
  order by c.creation_date desc
   limit 6 offset ${offset}`),
    //// not search havn't category and havn't check (sort)

    pageByCourse: (offset) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname,
    round(avg(f.rating),1) as rating, count(f.rating) as num_of_rating    
   FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
    f on c.id = f.id_course
   group by c.id
    limit 6 offset ${offset}`),

    getCountCourseByCate: async(id) => {
        let count = await db.load(`   SELECT count(*) as total from
       ( select count(c.id)
       FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback
        f on c.id = f.id_course
          where  cat.id_parent = ${id}
       group by c.id) t`);
        return count[0].total;
    },

    countCourse: async() => {
        let count = await db.load(`select count(*) as total from course`);
        return count[0].total;
    },

    getListCategory: () => db.load(`select * from category where id_parent = 0;`),

    getChapterByCourseId: id => db.load(`select * from chapter where id_course = ${id}`),
    getLessonByChapterId: id => db.load(`select * from lesson where id_chapter = ${id}`),
    async getLessonById(id) {
        const rows = await db.load(`select * from lesson where id = '${id}'`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    top5CourseOtherMostBuy: (id_course, id_category) => db.load(`SELECT *,count(ec.id_course) as members 
    FROM enroll_course as ec LEFT JOIN course as c ON ec.id_course = c.id
    WHERE ec.id_course != ${id_course} AND c.id_category = ${id_category}
    GROUP BY ec.id_course LIMIT 5`),
    countMemberByCourseID: id => db.load(`SELECT count(id_course) as member 
    FROM enroll_course
    WHERE id_course = ${id}`),

    getCourseByTeacherId: id => db.load(`SELECT * 
    FROM course_teacher as ct left join course as c on ct.id_course = c.id
    where ct.id_teacher = ${id}`),
    addCourseTeacher: entity => db.add('course_teacher', entity),

    // check whether current user has purchased the course
    checkPurchasedCourse: async(idUser, idCourse) => {
        let count = await db.load(`select count(*) as total from enroll_course where id_user = ${idUser} and id_course = ${idCourse}`);
        return count[0].total;
    }
};
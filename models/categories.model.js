const db = require('../utils/db');

module.exports = {
    add: entity => db.add('category', entity),
    all: () => db.load(`select * from category`),
    top6CatMostEnrollWeek: () => db.load(`SELECT cat.url as caturl, cat.name, count(cat.id) as num
    FROM category cat LEFT JOIN course c on cat.id = c.id_category LEFT JOIN enroll_course ec on c.id = ec.id_course
    WHERE (TIMEDIFF(ec.enroll_date,NOW())<0) and (TIMEDIFF(ec.enroll_date,DATE_SUB(NOW(), INTERVAL 7 DAY)  )>0)  and ec.status = 1 
    GROUP BY cat.id
    ORDER BY num DESC limit 6`),

};
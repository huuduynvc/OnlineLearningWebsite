const db = require('../utils/db');

module.exports = {
    add: entity => db.add('category', entity),
    all: () => db.load(`select * from category`),

    async single(id) {
        const rows = await db.load(`select * from category where id = ${id}`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    patch: entity => {
        const condition = { id: entity.id };
        //delete entity.id;
        return db.patch('category', entity, condition);
    },

    top6CatMostEnrollWeek: () => db.load(`SELECT cat.url as caturl, cat.name, count(cat.id) as num
    FROM category cat LEFT JOIN course c on cat.id = c.id_category LEFT JOIN enroll_course ec on c.id = ec.id_course
    WHERE (TIMEDIFF(ec.enroll_date,NOW())<0) and (TIMEDIFF(ec.enroll_date,DATE_SUB(NOW(), INTERVAL 7 DAY)  )>0)  and ec.status = 1 
    GROUP BY cat.id
    ORDER BY num DESC limit 6`),

    top5CatMostEnroll: () => db.load(`SELECT cat.url as caturl, cat.name, count(cat.id) as num
    FROM category cat LEFT JOIN course c on cat.id = c.id_category LEFT JOIN enroll_course ec on c.id = ec.id_course
    GROUP BY cat.id
    ORDER BY num DESC limit 5`),

};
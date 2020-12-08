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

    top10Newest: () => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname, avg(f.rating) as rating, count(f.rating) as num_of_rating
    FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback f on c.id = f.id_course
    group by c.id
    ORDER BY c.creation_date DESC limit 10`),

};
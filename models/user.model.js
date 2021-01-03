const db = require('../utils/db');

module.exports = {
    add: entity => db.add('user', entity),
    all: () => db.load(`select * from user`),
    async single(id) {
        const rows = await db.load(`select * from user where id=${id}`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    del: id => db.del('user', { id: id }),
    delUserFeedback: id => db.del('feedback', { id_user: id }),
    delUserEnrollCourse: id => db.del('enroll_course', { id_user: id }),
    delUserTeacher: id => db.del('teacher', { id: id }),
    patch: (entity, id) => {
        const condition = { id: id };
        return db.patch('user', entity, condition);
    },
    async singleByUserName(username) {
        const rows = await db.load(`select * from user where username = '${username}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    async singleByEmail(email) {
        const rows = await db.load(`select * from user where email = '${email}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    getWatchList: id => db.load(`SELECT c.*,cat.name as catname,avg(f.rating)as rating, count(f.rating) as num_of_rating
    FROM watch_list as wt left join course as c on wt.id_course = c.id left join category as cat on c.id_category = cat.id  LEFT JOIN feedback as f on c.id = f.id_course
    WHERE wt.id_user = ${id}
    group by c.id`),

    addWatchList: entity => db.add('watch_list', entity),
    delWatchList: (id_user, id_course) => db.load(`delete from watch_list where id_user = ${id_user} and id_course = ${id_course}`),

    getBuyList: id => db.load(`SELECT c.*,cat.name as catname,avg(f.rating)as rating, count(f.rating) as num_of_rating
    FROM enroll_course as ec left join course as c on ec.id_course = c.id left join category as cat on c.id_category = cat.id  LEFT JOIN feedback as f on c.id = f.id_course
    WHERE ec.id_user = ${id}
    group by c.id`),

    countUser: () => db.load(`select count(*) as sl from user where status = 1`),
    countTeacher: () => db.load(`select count(*) as sl from user where role = 3 and status = 1`),
    countHappies: () => db.load(`select count(*) as sl from (select * from feedback where rating >=3 and status =1 group by id_user) as myalias`)
};
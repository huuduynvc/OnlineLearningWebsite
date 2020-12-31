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
    countUser: () => db.load(`select count(*) as sl from user where status = 1`),
    countTeacher: () => db.load(`select count(*) as sl from user where role = 3 and status = 1`),
    countHappies: () => db.load(`select count(*) as sl from (select * from feedback where rating >=3 and status =1 group by id_user) as myalias`)
};
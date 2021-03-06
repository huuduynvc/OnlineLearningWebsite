const db = require('../utils/db');

module.exports = {
    add: entity => db.add('teacher', entity),
    all: () => db.load(`SELECT *,t.status as teacherstatus FROM teacher as t LEFT JOIN user as u on t.id = u.id`),
    getTeacherByCourseId: course_id => db.load(`SELECT t.id as id, t.info, u.fullname, u.avatar, u.phone, u.email 
    FROM course_teacher as ct LEFT JOIN teacher as t on ct.id_teacher = t.id LEFT JOIN user as u on ct.id_teacher = u.id 
    WHERE id_course = ${course_id}`),
    async single(id) {
        const rows = await db.load(`SELECT *,t.status as teacherstatus FROM teacher as t LEFT JOIN user as u on t.id = u.id where t.id=${id}`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    async singleEnrollCourse(id_user, id_course) {
        const rows = await db.load(`SELECT * from enroll_course where id_user=${id_user} AND id_course = ${id_course}`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    patch: (entity, id) => {
        const condition = { id: id };
        return db.patch('teacher', entity, condition);
    },

    del: id => db.del('teacher', { id: id }),

    getApplyTeacher: () => db.load(`SELECT * FROM apply_teacher as t LEFT JOIN user as u on t.id = u.id`),
    addApply: entity => db.add('apply_teacher', entity),
    delApply: id => db.del('apply_teacher', { id: id }),

};
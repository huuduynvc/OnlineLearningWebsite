const db = require('../utils/db');

module.exports = {
    add: entity => db.add('teacher', entity),
    all: () => db.load(`SELECT * FROM teacher as t LEFT JOIN user as u on t.id = u.id where t.status = 1 `),
    getTeacherByCourseId: course_id => db.load(`SELECT t.id as id, t.info, u.fullname, u.avatar, u.phone, u.email 
    FROM course_teacher as ct LEFT JOIN teacher as t on ct.id_teacher = t.id LEFT JOIN user as u on ct.id_teacher = u.id 
    WHERE id_course = ${course_id}`),
    async single(id) {
        const rows = await db.load(`SELECT * FROM teacher as t LEFT JOIN user as u on t.id = u.id where t.id=${id} anđ t.status = 1`);
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
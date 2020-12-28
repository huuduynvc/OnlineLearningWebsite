const db = require('../utils/db');

module.exports = {
    all: () => db.load(`SELECT * FROM teacher as t LEFT JOIN user as u on t.id = u.id `),
    getTeacherByCourseId: course_id => db.load(`SELECT t.id as id, t.info, u.fullname, u.avatar, u.phone, u.email 
    FROM course_teacher as ct LEFT JOIN teacher as t on ct.id_teacher = t.id LEFT JOIN user as u on ct.id_teacher = u.id 
    WHERE id_course = ${course_id}`),

};
const db = require('../utils/db');

module.exports = {
    getTeacherByCourseId: course_id => db.load(`select u.fullname 
    from course_teacher ct left join user u on ct.id_teacher = u.id
    where id_course = ${course_id}`),
};
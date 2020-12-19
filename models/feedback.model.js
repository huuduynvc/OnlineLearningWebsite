const db = require('../utils/db');

module.exports = {
    getFeedbackByCourseId: course_id => db.load(`SELECT  u.fullname, u.avatar, f.*
    FROM feedback as f LEFT JOIN user as u on f.id_user = u.id
    WHERE id_course = ${course_id}`),

    getRatingByCourseId: course_id => db.load(`SELECT count(id_course) as num_of_rating, avg(rating) as rating  
    FROM feedback 
    WHERE id_course = ${course_id}`),

};
const db = require('../utils/db');

module.exports = {
    add: entity => db.add('user', entity),
    all: () => db.load(`select * from user`),
    countUser: () => db.load(`select count(*) as sl from user where status = 1`),
    countTeacher: () => db.load(`select count(*) as sl from user where role = 3 and status = 1`),
    countHappies: () => db.load(`select count(*) as sl from (select * from feedback where rating >=3 and status =1 group by id_user) as myalias`)
};
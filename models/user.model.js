const db = require('../utils/db');

const TBL_User ='user';

module.exports= {
    all(){
        return db.load('select * from ${TBL_User}');
    },
    async single(id){
        const rows = await db.load('select * from $(TBL_User) where id=${id}');
        if (rows.length===0)
        return null;

        return rows[0];
    },
    add(entity){
        return db.add(entity,TBL_User)
    },
}

module.exports = {
    add: entity => db.add('user', entity),
    all: () => db.load(`select * from user`),
    async singleByUserName(username) {
        const rows = await db.load(`select * from user where username = '${username}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    countUser: () => db.load(`select count(*) as sl from user where status = 1`),
    countTeacher: () => db.load(`select count(*) as sl from user where role = 3 and status = 1`),
    countHappies: () => db.load(`select count(*) as sl from (select * from feedback where rating >=3 and status =1 group by id_user) as myalias`)
};
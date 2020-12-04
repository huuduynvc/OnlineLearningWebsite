const db = require('../utils/db');

module.exports = {
    add: entity => db.add('user', entity),
    getListCategory: () => db.load(`select * from category`),
};
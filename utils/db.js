const mysql = require('mysql');
const util = require('util');
const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql);
const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  addStep1: (tableName, entity,nguoiBan) => mysql_query(`insert into ${tableName} set ten_SP = "${entity.ten_SP}",nguoiBan = ${nguoiBan}`),
  del: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, condition),
  delSpecial: (tableName,condition) => mysql_query(`delete from ${tableName} where ? and ?`, condition),
  delSpecial2: (tableName,condition1,condition2) => mysql_query(`delete from ${tableName} where id_SP = ${condition1} and id_NM = ${condition2}`),
  patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),
};

const db = require('../utils/db');
const config = require('../config/default.json');


module.exports = {
    searchByName: (tukhoa, offset, sort) => db.load(`SELECT c.*,cat.url as caturl, cat.name as catname, avg(f.rating) as rating, count(f.rating) as num_of_rating
    FROM course c LEFT JOIN category cat on c.id_category=cat.id LEFT JOIN feedback f on c.id = f.id_course
    WHERE MATCH(c.name, c.description) AGAINST('${tukhoa}' IN NATURAL LANGUAGE MODE) GROUP BY c.id ORDER BY c.creation_date ${sort} limit ${config.paginate.limit} offset ${offset}`),

    // searchByNamePlus: (tukhoa, idCat, offset, sort) => db.load(`select sp.*, count(c.id_SP) as num_of_bid from sanpham sp join dmsp dm ON dm.id_SP = sp.id LEFT JOIN chi_tiet_ra_gia c on sp.id=c.id_SP where ISNULL(sp.nguoiThang) AND dm.id_DM =${idCat} AND sp.timeEnd - now() > 0 AND
    // MATCH(sp.ten_SP, sp.moTaSP) AGAINST('${tukhoa}' IN NATURAL LANGUAGE MODE) GROUP BY sp.id ORDER BY ${sort} limit ${config.paginate.limit} offset ${offset}`),
};
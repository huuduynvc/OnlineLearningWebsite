const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from course'),
    single: id => db.load(`select * from course where id = ${id}`),
    add: entity => db.add('course', entity),
    del: id => db.del('course', { id: id }),
    patch: (entity, id) => {
        const condition = { id: id };
        delete entity.primaryAuto;
        return db.patch('course', entity, condition);
    },

    top5NearEnd: () => db.load(`SELECT sp.*,c.id_NM,n.lastname, count(c.id_SP) as num_of_bid
  FROM sanpham sp LEFT JOIN chi_tiet_ra_gia c on sp.id=c.id_SP LEFT JOIN nguoidung n on n.id_user = sp.nguoiGiuGia
  WHERE (TIMEDIFF(timeEnd,NOW()) > 0) 
  group by sp.id 
  ORDER BY timeEnd limit 5`),

    top5MostBid: () => db.load(`	SELECT sp.*,c.id_NM,n.lastname, count(c.id_SP) as num_of_bid
  FROM sanpham sp LEFT JOIN chi_tiet_ra_gia c on sp.id=c.id_SP LEFT JOIN nguoidung n on n.id_user = sp.nguoiGiuGia
  WHERE (TIMEDIFF(timeEnd,NOW()) > 0)
  GROUP BY sp.id
  ORDER BY num_of_bid DESC limit 5
  `),

    top5Pricest: () => db.load(`	SELECT sp.*,c.id_NM,n.lastname, count(c.id_SP) as num_of_bid
FROM sanpham sp LEFT JOIN chi_tiet_ra_gia c on sp.id=c.id_SP LEFT JOIN nguoidung n on n.id_user = sp.nguoiGiuGia 
WHERE (TIMEDIFF(timeEnd,NOW()) > 0)
GROUP BY sp.id
ORDER BY gia_HienTai DESC limit 5`),

};
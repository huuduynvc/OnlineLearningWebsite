const express = require('express');
const searchModel = require('../models/search.model');
const config = require('../config/default.json');
//const moment = require('moment');
const categoryModel = require('../models/categories.model');
const courseModel = require('../models/courses.model');
//const userModel = require('../models/user.model');
const router = express.Router();

router.get('/', async(req, res) => {
    // req.session.urlBack = req.originalUrl;
    // let sortBy = req.query.sortBy;
    // let orderBy;
    // if (req.query.selectCat === '') {
    //     req.query.selectCat = -1;
    // }
    // let sort = '';
    // let priceSort = 'Price';
    // //ban dau tim kiem thi mac dinh sort theo thoi gian ket thuc tang dan
    // if (sortBy === undefined) {
    //     sortBy = 'time';
    //     orderBy = 'asc';
    //     sort = 'timeEnd asc'; //mac dinh ngay giam dan
    // } else {
    //     if (sortBy === 'price') {
    //         orderBy = req.query.orderBy;
    //         if (orderBy === 'asc') {
    //             sort = 'gia_HienTai ' + orderBy;
    //             priceSort = 'Price Ascending';
    //         }

    //         if (orderBy === 'desc') {
    //             sort = 'gia_HienTai ' + orderBy;
    //             priceSort = 'Price Decreasing';
    //         }
    //     } else {
    //         sort = 'timeEnd asc'; //mac dinh ngay giam dan
    //     }
    // }
    // let checkSearch = false;
    // if (+req.query.selectCat !== -1) {
    //     checkSearch = true;
    // } else {
    //     checkSearch = false;
    // }

    const kw = "Lập trình" //req.query.keyword;
    const limit = config.paginate.limit;
    let page = req.query.page || 1;

    if (page < 1) page = 1;
    let offset = (page - 1) * config.paginate.limit;
    let total, rows;
    // if (checkSearch) {
    //     [total, rows] = await Promise.all([
    //         searchModel.countSearchByPlus(kw, req.query.selectCat),
    //         searchModel.searchByNamePlus(kw, req.query.selectCat, offset, sort)
    //     ]);
    // } else {

    //     [total, rows] = await Promise.all([
    //         searchModel.countSearchByName(kw),
    //         searchModel.searchByName(kw, offset, sort)
    //     ]);
    // }

    console.log(await searchModel.searchByName(kw, offset, 'desc'));

    // for (let row of rows) {
    //     //id sản phẩm
    //     row.id_SP = row.id;
    //     //link ảnh
    //     const link_anh = await productModel.getLinkImg(row.id);
    //     row.link = "/imgs/" + row.id + "/" + link_anh[0].link_anh;

    //     // //lay ten nguoi bid
    //     // const user = await userModel.single(row.nguoiGiuGia);
    //     // if (!(user === null)) {
    //     //     row.maskName = user.username.replace(/\w(?=\w{3})/g, "*");
    //     // } else {
    //     //     row.maskName = '';
    //     // }
    //     // if (req.session.isAuthenticated === true) {
    //     //     //check đã thích hay chưa
    //     //     const check = await userModel.singleLike(row.id, req.session.authUser.id_user);
    //     //     if (check === null) {
    //     //         row.isLike = false;
    //     //     } else {
    //     //         row.isLike = true;
    //     //     }
    //     // } else {
    //     //     row.isLike = false;
    //     // }
    // }
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        })
    }

    res.render('course', {
        // idCat: req.query.selectCat,
        // product: rows,
        // keyword: kw,
        // sortBy,
        // orderBy,
        // priceSort,
        // isSort: sortBy === 'price',
        // empty: rows.length === 0,
        page_numbers,
        cur_value: +page,
        prev_value: +page - 1 === 0 ? 1 : +page - 1,
        next_value: +page + 1 > nPages ? +page : +page + 1,
    });
});


module.exports = router;
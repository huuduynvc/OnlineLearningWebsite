const categoryModel = require('../models/categories.model');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const userModel = require('../models/user.model');
const numeral = require('numeral');

module.exports = function(app) {
    // function getMenu(data, id_find) {
    //     return (function(arr) {
    //         for (var i = 0; i < data.length; i++) {
    //             (function(item) {
    //                 if (!item || item.id_parent != id_find || !item.id || !item.name) return;
    //                 item = (function(json) {
    //                     var sub = getMenu(data, json.id);
    //                     if (sub.length > 0) json.sub = sub;
    //                     return json;
    //                 })({
    //                     id: item.id,
    //                     name: item.name,
    //                     url: item.url
    //                 });
    //                 return arr.push(item);
    //             })(data[i]);
    //         }
    //         return arr;
    //     })([])
    // }

    // function addCategories(obj) {
    //     htmlBuilder = '';
    //     for (var i = 0; i < obj.length; i++) {
    //         if (obj[i].sub != null)
    //             htmlBuilder += '<li class="nav-item active dropdown">' +
    //             `<a class="nav-link dropdown-toggle" href="${obj[i].url}" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    //   ${obj[i].name}
    // </a>`;
    //         else
    //             htmlBuilder += '<li class="nav-item active">' +
    //             `<a class="nav-link" href="${obj[i].url}">${obj[i].name}</a>`;

    //         if (obj[i].sub != null) {
    //             htmlBuilder += '<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
    //             htmlBuilder += addCategories(obj[i].sub);
    //             htmlBuilder += '</ul>';
    //         }
    //         htmlBuilder += '</li>';
    //     }

    //     return htmlBuilder;
    // }

    function createRating(i, rating, name) {
        html = `<div id="rater${name}${i}"></div>
        <script>
          var rating${name}${i} = raterJs({
            element:document.querySelector("#rater${name}${i}"),
            readOnly: true,
            max:5,
            starSize: 15, 
        });
        if(${rating} != null)
            rating${name}${i}.setRating(${rating});
        </script>`
        return html;
    }


    //render view
    app.get("/", async(req, res) => {
        const topCat = await categoryModel.top6CatMostEnrollWeek();
        const topCourseNew = await courseModel.top10Newest();
        var topNew1 = [];
        var topNew2 = [];
        for (let i = 0; i < 5; i++) {
            topNew1.push({
                id: topCourseNew[i].id,
                name: topCourseNew[i].name,
                caturl: topCourseNew[i].caturl,
                catname: topCourseNew[i].catname,
                rating: numeral(topCourseNew[i].rating).format('0,0'),
                rating_star: createRating(i, topCourseNew[i].rating, 'topNew'),
                num_of_rating: topCourseNew[i].num_of_rating,
                img: topCourseNew[i].image,
                current_price: numeral(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100).format('0,0'),
                price: numeral(topCourseNew[i].price).format('0,0'),
                offer: topCourseNew[i].offer,
                teacher: await teacherModel.getTeacherByCourseId(topCourseNew[i].id)
            });
        }
        for (let i = 5; i < 10; i++) {
            topNew2.push({
                id: topCourseNew[i].id,
                name: topCourseNew[i].name,
                caturl: topCourseNew[i].caturl,
                catname: topCourseNew[i].catname,
                rating: numeral(topCourseNew[i].rating).format('0.0'),
                rating_star: createRating(i, topCourseNew[i].rating, 'topNew'),
                num_of_rating: topCourseNew[i].num_of_rating,
                img: topCourseNew[i].image,
                current_price: numeral(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100).format('0,0'),
                price: numeral(topCourseNew[i].price).format('0,0'),
                offer: topCourseNew[i].offer,
                teacher: await teacherModel.getTeacherByCourseId(topCourseNew[i].id)
            });
        }

        const topCourseView = await courseModel.top10Viewest();
        var topView1 = [];
        var topView2 = [];
        for (let i = 0; i < 5; i++) {
            topView1.push({
                id: topCourseView[i].id,
                name: topCourseView[i].name,
                caturl: topCourseView[i].caturl,
                catname: topCourseView[i].catname,
                rating: numeral(topCourseView[i].rating).format('0,0'),
                rating_star: createRating(i, topCourseView[i].rating, 'topView'),
                num_of_rating: topCourseView[i].num_of_rating,
                img: topCourseView[i].image,
                current_price: numeral(topCourseView[i].price - topCourseView[i].price * topCourseView[i].offer / 100).format('0,0'),
                price: numeral(topCourseView[i].price).format('0,0'),
                offer: topCourseView[i].offer,
                teacher: await teacherModel.getTeacherByCourseId(topCourseView[i].id)
            });
        }
        for (let i = 5; i < 10; i++) {
            topView2.push({
                id: topCourseView[i].id,
                name: topCourseView[i].name,
                caturl: topCourseView[i].caturl,
                catname: topCourseView[i].catname,
                rating: numeral(topCourseView[i].rating).format('0,0'),
                rating_star: createRating(i, topCourseView[i].rating, 'topView'),
                num_of_rating: topCourseView[i].num_of_rating,
                img: topCourseView[i].image,
                current_price: numeral(topCourseView[i].price - topCourseView[i].price * topCourseView[i].offer / 100).format('0,0'),
                price: numeral(topCourseView[i].price).format('0,0'),
                offer: topCourseView[i].offer,
                teacher: await teacherModel.getTeacherByCourseId(topCourseView[i].id)
            });
        }

        const topCourseHot = await courseModel.top5Hot();
        var topHot = [];
        for (let i = 0; i < topCourseHot.length; i++) {
            topHot.push({
                id: topCourseHot[i].id,
                name: topCourseHot[i].name,
                caturl: topCourseHot[i].caturl,
                catname: topCourseHot[i].catname,
                rating: numeral(topCourseHot[i].rating).format('0,0'),
                rating_star: createRating(i, topCourseHot[i].rating, 'topHot'),
                num_of_rating: topCourseHot[i].num_of_rating,
                img: topCourseHot[i].image,
                current_price: numeral(topCourseHot[i].price - topCourseHot[i].price * topCourseHot[i].offer / 100).format('0,0'),
                price: numeral(topCourseHot[i].price).format('0,0'),
                offer: topCourseHot[i].offer,
                teacher: await teacherModel.getTeacherByCourseId(topCourseHot[i].id)
            });
        }

        res.render("home", {
            menu: res.locals.menu,
            topCat,
            topNew1,
            topNew2,
            topView1,
            topView2,
            topHot,
            countUser: (await userModel.countUser())[0],
            countTeacher: (await userModel.countTeacher())[0],
            countHappies: (await userModel.countHappies())[0]
        });
    })

    app.use('/account', require('../routes/account.route'));
    // course
    app.use('/course', require('../routes/courses.route'));

    app.use('/admin', require('../routes/admin.route'));
}
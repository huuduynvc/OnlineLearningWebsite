const categoryModel = require('../models/categories.model');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const userModel = require('../models/user.model');
const numeral = require('numeral');

module.exports = function(app) {
    function getMenu(data, id_find) {
        return (function(arr) {
            for (var i = 0; i < data.length; i++) {
                (function(item) {
                    if (!item || item.id_parent != id_find || !item.id || !item.name) return;
                    item = (function(json) {
                        var sub = getMenu(data, json.id);
                        if (sub.length > 0) json.sub = sub;
                        return json;
                    })({
                        id: item.id,
                        name: item.name,
                        url: item.url
                    });
                    return arr.push(item);
                })(data[i]);
            }
            return arr;
        })([])
    }

    function addCategories(obj) {
        htmlBuilder = '';
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].sub != null)
                htmlBuilder += '<li class="nav-item active dropdown">' +
                `<a class="nav-link dropdown-toggle" href="${obj[i].url}" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      ${obj[i].name}
    </a>`;
            else
                htmlBuilder += '<li class="nav-item active">' +
                `<a class="nav-link" href="${obj[i].url}">${obj[i].name}</a>`;

            if (obj[i].sub != null) {
                htmlBuilder += '<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
                htmlBuilder += addCategories(obj[i].sub);
                htmlBuilder += '</ul>';
            }
            htmlBuilder += '</li>';
        }

        return htmlBuilder;
    }

    function createRating(i, rating) {
        html = `<div id="rater${i}"></div>
        <script>
          var rating${i} = raterJs({
            element:document.querySelector("#rater${i}"),
            readOnly: true,
            max:5,
            starSize: 15, 
        });
        if(${rating} != null)
            rating${i}.setRating(${rating});
        </script>`
        return html;
    }


    //render view
    app.get("/", async(req, res) => {
        const categories = await categoryModel.all();
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
                rating_star: createRating(i, topCourseNew[i].rating),
                num_of_rating: topCourseNew[i].num_of_rating,
                img: topCourseNew[i].image,
                price: numeral(topCourseNew[i].price).format('0,0'),
                offer: topCourseNew[i].offer,
                current_price: numeral(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100).format('0,0'),
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
                rating_star: createRating(i, topCourseNew[i].rating),
                num_of_rating: topCourseNew[i].num_of_rating,
                img: topCourseNew[i].image,
                price: numeral(topCourseNew[i].price).format('0,0'),
                offer: topCourseNew[i].offer,
                current_price: numeral(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100).format('0,0'),
                teacher: await teacherModel.getTeacherByCourseId(topCourseNew[i].id)
            });
        }

        const catObj = getMenu(categories, 0);
        const html = addCategories(catObj);

        res.render("home", {
            menu: html,
            topCat: topCat,
            topNew1: topNew1,
            topNew2: topNew2,
            countUser: (await userModel.countUser())[0],
            countTeacher: (await userModel.countTeacher())[0],
            countHappies: (await userModel.countHappies())[0]
        });
    })

    app.use('/account', require('../routes/account.route'));
    // course
    app.use('/course', require('../routes/courses.route'));
}
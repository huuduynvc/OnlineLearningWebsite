const categoryModel = require('../models/categories.model');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const userModel = require('../models/user.model');
const numeral = require('numeral');
const auth = require('../middlewares/auth.mdw');

module.exports = function(app) {
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
                image: topCourseNew[i].image,
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
                image: topCourseNew[i].image,
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
                image: topCourseView[i].image,
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
                image: topCourseView[i].image,
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
                image: topCourseHot[i].image,
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

    app.get("/become", auth, async(req, res) => {
        const err_message = req.session.err_message;
        req.session.err_message = null;
        res.render("become", {
            err_message,
            layout: "sub.handlebars"
        });
    })

    app.post("/become", auth, async(req, res) => {
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        var apply = {
            id_teacher: req.session.authUser.id,
            info: req.body.txtDes,
            apply_date: new Date(datetime),
        }

        if (await teacherModel.addApply(apply)) {
            req.session.err_message = "Gửi thông tin thành công. Chúng tôi sẽ xem xét yêu cầu của bạn sớm nhất.";
        } else {
            req.session.err_message = "Gửi thông tin thất bại.";
        };
        res.redirect("/become");
    })


    app.use('/account', require('../routes/account.route'));

    app.use('/course', require('../routes/courses.route'));

    app.use('/teacher', require('../routes/teacher.route'));

    app.use('/admin', require('../routes/admin.route'));
}
const express = require('express');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const feedbackModel = require('../models/feedback.model');
const coursesModel = require('../models/courses.model');
const authRole = require('../middlewares/auth.mdw');
const router = express.Router();
const moment = require('moment');
const numeral = require('numeral');
const e = require('express');

router.get('/', async(req, res) => {
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * 6;
    let total = await courseModel.countCourse();
    let nPages = Math.ceil(total / 6);
    let page_items = [];
    let listCategory = await courseModel.getListCategory();
    let arrayCategory = [];
    //test
    let checkkk = true;
    for (let cate of listCategory) {
        arrayCategory.push({
            id: cate.id,
            name: cate.name,
            id_parent: cate.id_parent,
            url: cate.url
        });
    }
    for (i = 2; i <= nPages; i++) {
        let item = {
            value: i
        }
        page_items.push(item);
    }
    let listCourse = await courseModel.pageByCourse(offset, "");
    console.log(listCourse);
    let arrayCourse = [];
    for (let course of listCourse) {
        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: course.rating,
            num_of_rating: course.num_of_rating,
            img: course.image,
            current_price: numeral(course.price - course.price * course.offer / 100).format('0,0'),
            price: numeral(course.price).format('0,0'),
            offer: course.offer,
            teacher: await teacherModel.getTeacherByCourseId(course.id)
        });
    }

    res.render('course', {
        listCourse: arrayCourse,
        page_items,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        prev_page: page - 1,
        next_page: page + 1,
        listCategory: arrayCategory,
        check: checkkk,
    });
});

router.post('/', async(req, res) => {
    let check = req.body.check;
    let key = req.body.key;

    let page = parseInt(req.body.page);
    //let page = 1;
    let offset = (page - 1) * 6;
    //let listCourse = await courseModel.fullTextSearch(offset, key);
    let listCourse = await courseModel.pageByCourse(offset, key);
    let total = await courseModel.countCourse();
    let nPages = Math.ceil(total / 6);
    let page_items = [];
    let listCategory = await courseModel.getListCategory();
    let arrayCategory = [];
    if (check == "priceincrease")
        listCourse = await courseModel.orderByPriceAsc(offset, key);
    if (check == "pricedecrease")
        listCourse = await courseModel.orderByPriceDesc(offset, key);
    if (check == "rateincrease")
        listCourse = await courseModel.orderByRateAsc(offset, key);
    if (check == "ratedecrease")
        listCourse = await courseModel.orderByRateDesc(offset, key);
    if (check == "newcourse")
        listCourse = await courseModel.orderByNewCourse(offset, key);
    if (check == "learnestcourse")
        listCourse = await courseModel.orderByNewCourse(offset, key);
    if (check == undefined && key == "")
        listCourse = await courseModel.pageByCourse(offset, key);
    if (key != "")
        listCourse = await courseModel.fullTextSearch(offset, key);


    //test
    let checkkk = true;
    for (let cate of listCategory) {
        arrayCategory.push({
            id: cate.id,
            name: cate.name,
            id_parent: cate.id_parent,
            url: cate.url
        });
    }
    for (i = 1; i <= nPages; i++) {
        let item = {
            value: i
        }
        page_items.push(item);
    }

    console.log(listCourse);
    let arrayCourse = [];
    for (let course of listCourse) {
        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: course.rating,
            num_of_rating: course.num_of_rating,
            img: course.image,
            current_price: numeral(course.price - course.price * course.offer / 100).format('0,0'),
            price: numeral(course.price).format('0,0'),
            offer: course.offer,
            teacher: await teacherModel.getTeacherByCourseId(course.id)
        });
    }
    var html = "";
    for (let item of arrayCourse) {

        let t = "";
        for (let teach of item.teacher) {
            t += `${teach.fullname},`;
        }
        let s = "";
        for (let i = 0; i < item.rating; i++) {
            s += `<span class="mai-star"></span> `;
        }
        html += ` <div class="item">
    <div class="course-card">
            <div class="badge badge-danger">New</div>
            <div class="header">
              <img src="/img/course/${item.id}.jpg" alt="">
            </div>
            <div class="content text-left">
              <p class="course-title"><a href="${item.caturl}/${item.id}" title="Artificial Intelligence">${item.name}</a></p>
              <small style="margin-bottom:0!important;color: #3f3c3c; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${item.catname}</small>
              </br>
              <small style="color: #676565; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">` +
            t +
            `</small>
              <div class="rating">
                <span class="number-rating"><b>${item.rating}</b></span>` +
            s +
            `<span class="person-rating" style="color:black;">(${item.num_of_rating})</span>
              </div>
              <div class="price" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                <span class="text-danger font-weight-bold">${item.current_price}</span> <del class="text-muted">${item.price}</del>
              </div>
            </div>                     
          </div>
  </div>`;
    }
    res.send({
        test: html,
    })
});

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

router.get('/:id', async(req, res) => {

    await courseModel.update(req.params.id);
    const course = await coursesModel.single(req.params.id);
    const chapter = await coursesModel.getChapterByCourseId(req.params.id);
    var chapter_lesson = [];
    for (let i = 0; i < chapter.length; i++) {
        const les = await coursesModel.getLessonByChapterId(chapter[i].id);
        var lesson = [];
        for (let j = 0; j < les.length; j++) {
            lesson.push({
                ...les[j]
            });
        }

        //console.log(lesson);

        chapter_lesson.push({
            ...chapter[i],
            lesson
        });
    }

    // console.log(chapter_lesson);
    // console.log(chapter_lesson[0].lesson);

    var course_detail = {
        ...course,
        chapter_lesson
    }

    course_detail.modification_date = moment(course_detail.modification_date).format('hh:mm:ss DD/MM/YYYY');
    course_detail.current_price = numeral(course_detail.price - course_detail.price * course_detail.offer / 100).format('0,0');
    course_detail.price = numeral(course_detail.price).format('0,0');

    console.log(course_detail);

    const top5course = await coursesModel.top5CourseOtherMostBuy(course_detail.id, course_detail.id_category);
    for (let i = 0; i < top5course.length; i++) {
        top5course[i].modification_date = moment(top5course[i].modification_date).format('DD/MM/YYYY');
        top5course[i].num_of_member = (await coursesModel.countMemberByCourseID(top5course[i].id))[0];
        top5course[i].rating = (await feedbackModel.getRatingByCourseId(top5course[i].id))[0];
    }
    //console.log(top5course);
    const teacher = await teacherModel.getTeacherByCourseId(course_detail.id);
    //console.log(teacher);
    const feedback = await feedbackModel.getFeedbackByCourseId(course_detail.id);
    //console.log(feedback);
    for (let i = 0; i < feedback.length; i++) {
        feedback[i].modification_date = moment(feedback[i].modification_date).format('HH:mm:ss DD/MM/YYYY');
        feedback[i].rating_star = createRating(i, feedback[i].rating, 'feedback');
    }
    const rating = (await feedbackModel.getRatingByCourseId(course_detail.id))[0];
    //console.log(rating.num_of_rating);
    const num_of_member = (await coursesModel.countMemberByCourseID(course_detail.id))[0];

    res.render('vwCourse/course-detail', {
        course_detail,
        top5course,
        teacher,
        feedback,
        rating,
        num_of_member,
        menu: res.locals.menu,
        layout: 'sub.handlebars'
    });
});

router.post('/:id', authRole, async(req, res) => {
    if (req.session.isAuth) {
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        const feedback = {
            rating: req.body.rating,
            comment: req.body.msg,
            id_course: req.params.id,
            id_user: req.session.authUser.id,
            creation_date: new Date(datetime),
            modification_date: new Date(datetime),
            status: 1,
        }

        await feedbackModel.add(feedback);

        let url = req.session.retUrl || '/';
        res.redirect(url);
    } else {
        res.render('/account/login');
    }

});

router.get('/:id/lesson/:id_lesson', async(req, res) => {
    await courseModel.update(req.params.id);
    const course = await coursesModel.single(req.params.id);
    const chapter = await coursesModel.getChapterByCourseId(req.params.id);
    const lesson_detail = await courseModel.getLessonById(req.params.id_lesson);
    var chapter_lesson = [];
    for (let i = 0; i < chapter.length; i++) {
        const les = await coursesModel.getLessonByChapterId(chapter[i].id);
        var lesson = [];
        for (let j = 0; j < les.length; j++) {
            lesson.push({
                ...les[j]
            });
        }

        //console.log(lesson);

        chapter_lesson.push({
            ...chapter[i],
            lesson
        });
    }

    // console.log(chapter_lesson);
    // console.log(chapter_lesson[0].lesson);

    var course_detail = {
        ...course,
        chapter_lesson
    }

    res.render('vwCourse/lesson', {
        course_detail,
        lesson_detail,
        menu: res.locals.menu,
        layout: 'sub.handlebars'
    });

});

router.get('/:id/buy', async(req, res) => {
    const course = await coursesModel.single(req.params.id);

    course.modification_date = moment(course.modification_date).format('hh:mm:ss DD/MM/YYYY');
    course.current_price = numeral(course.price - course.price * course.offer / 100).format('0,0');
    course.price = numeral(course.price).format('0,0');

    const teacher = await teacherModel.getTeacherByCourseId(course.id);

    console.log(course);

    res.render('vwCourse/buy-course', {
        course,
        teacher,
        menu: res.locals.menu,
        layout: 'sub.handlebars'
    });

});

router.post('/:id/buy', authRole, async(req, res) => {
    if (req.session.isAuth) {
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        const enroll = {
            id_course: req.params.id,
            id_user: req.session.authUser.id,
            enroll_date: new Date(datetime),
            status: 1,
        }

        await courseModel.enrollCourse(enroll);

        res.redirect(`/course/${req.params.id}`);
    } else {
        res.render('/account/login');
    }

});

module.exports = router;
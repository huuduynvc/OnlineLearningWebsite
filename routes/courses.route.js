const express = require('express');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const feedbackModel = require('../models/feedback.model');
const authRole = require('../middlewares/auth.mdw');
const router = express.Router();
const moment = require('moment');
const numeral = require('numeral');
const userModel = require('../models/user.model');

const { create } = require('express-handlebars');
//ratting
//

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
    let arrayCourse = [];
    const top5Idhot = await courseModel.top5IdHot();
    //Get today's date using the JavaScript Date object.
    var ourDate = new Date();

    //Change it so that it is 7 days in the past.
    var pastDate = ourDate.getDate() - 7;
    ourDate.setDate(pastDate);
    for (let [i, course] of listCourse.entries()) {
        var isnew = false;
        if (new Date(course.creation_date).getTime() > ourDate.getTime()) {
            isnew = true;
        }

        var ishot = false;
        for (let j = 0; j < top5Idhot.length; j++) {
            if (course.id == top5Idhot[j].id) {
                ishot = true;
                break;
            }
        }

        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: numeral(course.rating).format('0,0'),
            rating_star: createRating(i, course.rating, 'rating'),
            num_of_rating: course.num_of_rating,
            img: course.image,
            current_price: numeral(course.price - course.price * course.offer / 100).format('0,0'),
            price: numeral(course.price).format('0,0'),
            offer: course.offer,
            teacher: await teacherModel.getTeacherByCourseId(course.id),
            isnew: isnew,
            ishot: ishot
        });
    }
    if (req.query.search == undefined)
        req.query.search = "";
    if (req.query.cate == undefined)
        req.query.cate = -1;
    res.render('vwCourse/course', {
        listCourse: arrayCourse,
        page_items,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        prev_page: page - 1,
        next_page: page + 1,
        listCategory: arrayCategory,
        check: checkkk,
        redirect: req.query.redirect,
        idcate: req.query.cate,
        keysearch: req.query.search,
        layout: 'sub.handlebars',

    });
});

router.post('/', async(req, res) => {
    // get request from ajax
    let check = req.body.check;
    let key = req.body.key;
    let page = parseInt(req.body.page);
    let indexCate = +req.body.cate;
    // pagination
    let offset = (page - 1) * 6;
    let total = await courseModel.countCourse();
    let nPages = Math.ceil(total / 6);
    var disablePage = false;

    // get list course
    let listCourse = await courseModel.pageByCourse(offset);

    ///////////////////////////////////
    // search
    if (key != "") {
        if (indexCate != -1) // have category
        {
            total = await courseModel.getCountCourseByCateHaveSearch(indexCate, key);
            nPages = Math.ceil(total / 6);
            if (check != undefined) // have check
            {
                if (check == "priceincrease")
                    listCourse = await courseModel.searchCateCheckPriceASC(key, indexCate, offset);
                if (check == "pricedecrease")
                    listCourse = await courseModel.searchCateCheckPriceDESC(key, indexCate, offset);
                if (check == "rateincrease")
                    listCourse = await courseModel.searchCateCheckRateASC(key, indexCate, offset);
                if (check == "ratedecrease")
                    listCourse = await courseModel.searchCateCheckRateDESC(key, indexCate, offset);
                if (check == "newcourse")
                    listCourse = await courseModel.searchCateCheckNewCourse(key, indexCate, offset);
                if (check == "learnestcourse")
                    listCourse = await courseModel.searchCateCheckNewCourse(key, indexCate, offset);
            } else // havn't check
            {
                listCourse = await courseModel.searchCateNotCheck(key, indexCate, offset);
            }

        } else // havn't category
        {
            total = await courseModel.getCountCourseByNotCateHaveSearch(key);
            nPages = Math.ceil(total / 6);
            if (check != undefined) // have check
            {
                if (check == "priceincrease")
                    listCourse = await courseModel.searchNotCateCheckPriceASC(key, offset);
                if (check == "pricedecrease")
                    listCourse = await courseModel.searchNotCateCheckPriceDESC(key, offset);
                if (check == "rateincrease")
                    listCourse = await courseModel.searchNotCateCheckRateASC(key, offset);
                if (check == "ratedecrease")
                    listCourse = await courseModel.searchNotCateCheckRateDESC(key, offset);
                if (check == "newcourse")
                    listCourse = await courseModel.searchNotCateCheckNewCourse(key, offset);
                if (check == "learnestcourse")
                    listCourse = await courseModel.searchNotCateCheckNewCourse(key, offset);
            } else // havn't check
            {
                listCourse = await courseModel.searchNotCateNotCheck(key, offset);
            }

        }
    } else // not search
    {
        if (indexCate != -1) // have category
        {
            total = await courseModel.getCountCourseByCate(indexCate);
            nPages = Math.ceil(total / 6);
            if (check != undefined) // have check
            {
                if (check == "priceincrease")
                    listCourse = await courseModel.notSearchCateCheckPriceASC(indexCate, offset);
                if (check == "pricedecrease")
                    listCourse = await courseModel.notSearchCateCheckPriceDESC(indexCate, offset);
                if (check == "rateincrease")
                    listCourse = await courseModel.notSearchCateCheckRateASC(indexCate, offset);
                if (check == "ratedecrease")
                    listCourse = await courseModel.notSearchCateCheckRateDESC(indexCate, offset);
                if (check == "newcourse")
                    listCourse = await courseModel.notSearchCateCheckNewCourse(indexCate, offset);
                if (check == "learnestcourse")
                    listCourse = await courseModel.notSearchCateCheckNewCourse(indexCate, offset);
            } else // havn't check
            {
                listCourse = await courseModel.notSearchCateNotCheck(indexCate, offset);
            }
        } else // havn't category
        {
            if (check != undefined) // have check
            {
                if (check == "priceincrease")
                    listCourse = await courseModel.notSearchNotCateCheckPriceASC(offset);
                if (check == "pricedecrease")
                    listCourse = await courseModel.notSearchNotCateCheckPriceDESC(offset);
                if (check == "rateincrease")
                    listCourse = await courseModel.notSearchNotCateCheckRateASC(offset);
                if (check == "ratedecrease")
                    listCourse = await courseModel.notSearchNotCateCheckRateDESC(offset);
                if (check == "newcourse")
                    listCourse = await courseModel.notSearchNotCateCheckNewCourse(offset);
                if (check == "learnestcourse")
                    listCourse = await courseModel.notSearchNotCateCheckNewCourse(offset);
            }
            // else // havn't check
            // {
            //    //listCourse = await courseModel.notSearchNotCateNotCheck(indexCate, offset);
            // }
        }
    }

    ///////////////////////////////////
    if (page == nPages) {
        disablePage = true;
    }

    //let listCourse = await courseModel.fullTextSearch(offset, key);

    // if(indexCate != '-1')
    // listCourse  = await courseModel.getListCourseByCate(indexCate);
    let page_items = [];
    let listCategory = await courseModel.getListCategory();
    let arrayCategory = [];
    // if (check == "priceincrease")
    //     listCourse = await courseModel.orderByPriceAsc(offset, key);
    // if (check == "pricedecrease")
    //     listCourse = await courseModel.orderByPriceDesc(offset, key);
    // if (check == "rateincrease")
    //     listCourse = await courseModel.orderByRateAsc(offset, key);
    // if (check == "ratedecrease")
    //     listCourse = await courseModel.orderByRateDesc(offset, key);
    // if (check == "newcourse")
    //     listCourse = await courseModel.orderByNewCourse(offset, key);
    // if (check == "learnestcourse")
    //     listCourse = await courseModel.orderByNewCourse(offset, key);
    // if (check == undefined && key == "")
    //     listCourse = await courseModel.pageByCourse(offset, key);
    // if (key != "")
    //     listCourse = await courseModel.fullTextSearch(offset, key);


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

    let arrayCourse = [];
    const top5Idhot = await courseModel.top5IdHot();
    for (let [i, course] of listCourse.entries()) {
        //Get today's date using the JavaScript Date object.
        var ourDate = new Date();

        //Change it so that it is 7 days in the past.
        var pastDate = ourDate.getDate() - 7;
        ourDate.setDate(pastDate);

        // //Log the date to our web console.
        // console.log(ourDate);
        // console.log(new Date(course.creation_date));
        // console.log(new Date(course.creation_date).getTime() > ourDate.getTime());
        var isnew = false;
        if (new Date(course.creation_date).getTime() > ourDate.getTime()) {
            isnew = true;
        }

        var ishot = false;
        for (let j = 0; j < top5Idhot.length; j++) {
            if (course.id == top5Idhot[j].id) {
                ishot = true;
                break;
            }
        }
        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: numeral(course.rating).format('0,0'),
            num_of_rating: course.num_of_rating,
            img: course.image,
            current_price: numeral(course.price - course.price * course.offer / 100).format('0,0'),
            price: numeral(course.price).format('0,0'),
            offer: course.offer,
            teacher: await teacherModel.getTeacherByCourseId(course.id),
            isnew: isnew,
            ishot: ishot
        });
    }
    var rating = "";
    var html = "";

    for (let [i, item] of arrayCourse.entries()) {

        let t = "";
        for (let teach of item.teacher) {
            t += `${teach.fullname},`;
        }
        let s = "";
        for (let i = 0; i < item.rating; i++) {
            s += `<span class="mai-star"></span> `;
        }
        rating = createRating(i, item.rating, "rating")
        html += ` <div class="item" id = "${item.id}" style="cursor: pointer;">
    <div class="course-card">`
        if (item.ishot) {
            html += `<div class="bleft d-flex justify-content-center align-items-center"><span class="" style="color: white;">Hot</span></div>`;
            if (item.offer > 0) {
                html += `<div class="bright d-flex justify-content-center align-items-center"><span class="" style="color: white;">-${item.offer}%</span></div>`;
            }
        } else {
            if (item.offer > 0) {
                html += `<div class="bleftnew d-flex justify-content-center align-items-center"><span class="" style="color: white;">-${item.offer}%</span></div>`;
            }
        }
        html += `<div class="badge badge-danger d-flex justify-content-center align-items-center"><a href="/account/addwatchlist/${item.id}" style="color: white;"><i class="fa fa-heart-o fa-lg" aria-hidden="true"></i></a></div>
    <a href="/course/${item.id}"><div class="header">
              <img src="/img/course/${item.id}.jpg" alt="">
            </div></a>
            <div class="content text-left">`;
        if (item.isnew) {
            html += `<div class="bhot d-flex justify-content-center align-items-center"><span class="" style="color: white;">New</span></div>`;
        }
        html += `<p class="course-title"><a href="${item.caturl}/${item.id}">${item.name}</a></p>
              <small style="margin-bottom:0!important;color: #3f3c3c; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${item.catname}</small>
              </br>
              <small style="color: #676565; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">` +
            t +
            `</small>
              <div class="rating">
                <span class="number-rating"><b>${item.rating}</b></span>` +
            rating +
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
        html: html,
        disable: disablePage,
        nPages: nPages,
        redirect: false,
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
    const course = await courseModel.single(req.params.id);
    const chapter = await courseModel.getChapterByCourseId(req.params.id);
    var chapter_lesson = [];
    for (let i = 0; i < chapter.length; i++) {
        const les = await courseModel.getLessonByChapterId(chapter[i].id);
        var lesson = [];
        var isOne = true;
        for (let j = 0; j < les.length; j++) {
            if(i==0 && j ==0)
            lesson.push({
                ...les[j],
                isOne
            });
            else
            lesson.push({
                ...les[j],
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

    //console.log(course_detail);

    const top5course = await courseModel.top5CourseOtherMostBuy(course_detail.id, course_detail.id_category);
    for (let i = 0; i < top5course.length; i++) {
        top5course[i].modification_date = moment(top5course[i].modification_date).format('DD/MM/YYYY');
        top5course[i].num_of_member = (await courseModel.countMemberByCourseID(top5course[i].id))[0];
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
    const num_of_member = (await courseModel.countMemberByCourseID(course_detail.id))[0];

    // check whether current user has purchased the course
    var checkUserPurchased = false;
    if (req.session.isAuth) {
        const userPurchased = await courseModel.checkPurchasedCourse(req.session.authUser.id, course.id);
        if (userPurchased != 0) {
            checkUserPurchased = true;
        }
    }

    res.render('vwCourse/course-detail', {
        course_detail,
        top5course,
        teacher,
        feedback,
        rating,
        num_of_member,
        menu: res.locals.menu,
        sessionuser: req.session.isAuth,
        checkUserPurchased,
        isCourse: false,
        isOne,
        layout: 'sub.handlebars'
    });

});

router.post('/:id', authRole, async(req, res) => {
    const userPurchased = await courseModel.checkPurchasedCourse(req.session.authUser.id, req.params.id);
    // if(userPurchased==0)
    // {
    //     res.send("vui lòng mua khóa học để rating!");
    // }
    // else
    // {
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
    //}
});

router.get('/:id/lesson/:id_lesson', async(req, res) => {
    if (req.session.isAuth) {
        await courseModel.update(req.params.id);
        const course = await courseModel.single(req.params.id);
        const chapter = await courseModel.getChapterByCourseId(req.params.id);
        const lesson_detail = await courseModel.getLessonById(req.params.id_lesson);
        var chapter_lesson = [];
        for (let i = 0; i < chapter.length; i++) {
            const les = await courseModel.getLessonByChapterId(chapter[i].id);
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
    } else {
        res.redirect('/account/login');
    }
});

router.get('/:id/buy', async(req, res) => {
    const course = await courseModel.single(req.params.id);

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

router.get('/getcourse/detail', async function(req, res) {
    const course = await courseModel.single(req.query.id);
    const chapter = await courseModel.getChapterByCourseId(req.query.id);
    var chapter_lesson = [];
    for (let i = 0; i < chapter.length; i++) {
        const les = await courseModel.getLessonByChapterId(chapter[i].id);
        var lesson = [];
        for (let j = 0; j < les.length; j++) {
            lesson.push({
                ...les[j]
            });
        }

        chapter_lesson.push({
            ...chapter[i],
            lesson
        });
    }

    var course_detail = {
        ...course,
        chapter_lesson
    }

    course_detail.modification_date = moment(course_detail.modification_date).format('hh:mm:ss DD/MM/YYYY');
    course_detail.current_price = numeral(course_detail.price - course_detail.price * course_detail.offer / 100).format('0,0');
    course_detail.price = numeral(course_detail.price).format('0,0');

    const teacher = await teacherModel.getTeacherByCourseId(course_detail.id);

    const feedback = await feedbackModel.getFeedbackByCourseId(course_detail.id);

    for (let i = 0; i < feedback.length; i++) {
        feedback[i].modification_date = moment(feedback[i].modification_date).format('HH:mm:ss DD/MM/YYYY');
        feedback[i].rating_star = createRating(i, feedback[i].rating, 'feedback');
    }
    const rating = (await feedbackModel.getRatingByCourseId(course_detail.id))[0];

    const num_of_member = (await courseModel.countMemberByCourseID(course_detail.id))[0];

    courses = {
        course_detail,
        teacher,
        feedback,
        rating,
        num_of_member,
    };

    return res.json(courses);
});

module.exports = router;
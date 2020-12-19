const express = require('express');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const feedbackModel = require('../models/feedback.model');
const coursesModel = require('../models/courses.model');
const router = express.Router();

router.get('/:index', async(req, res) => {
    const page = req.query.page || 1;
    const offset = (page - 1) * 6;
    const total = await courseModel.countCourse();
    const nPages = Math.ceil(total / 6);
    const page_items = [];
    for (i = 1; i <= nPages; i++) {
        const item = {
            value: i
        }
        page_items.push(item);
    }
    const listCourse = await courseModel.pageByCourse(offset);
    console.log(listCourse);
    const arrayCourse = [];
    for (let course of listCourse) {
        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: course.rating,
            num_of_rating: course.num_of_rating,
            img: course.image,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price),
            offer: course.offer,
            current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price - course.price * course.offer / 100),
            teacher: await teacherModel.getTeacherByCourseId(course.id)
        });
    }
    // const arrayCourse = listCourse.map( async (x)=>{
    //     const teacher = await teacherModel.getTeacherByCourseId(x.id);
    //     return await {id: x.id,
    //             name: x.name,
    //             caturl: x.caturl,
    //             catname: x.catname,
    //             rating: x.rating,
    //             num_of_rating: x.num_of_rating,
    //             img: x.image,
    //             price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x.price),
    //             offer: x.offer,
    //             current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x.price - x.price * x.offer / 100),
    //             teacher:  teacher
    //         }
    // });

    res.render('course', {
        listCourse: arrayCourse,
        page_items
    });
});

router.get('/:category/:id', async(req, res) => {

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
        ...course[0],
        chapter_lesson
    }

    //console.log(course_detail);
    const top5course = await coursesModel.top5CourseOtherMostBuy(course_detail.id, course_detail.id_category);
    //console.log(top5course);
    const teacher = await teacherModel.getTeacherByCourseId(course_detail.id);
    //console.log(teacher);
    const feedback = await feedbackModel.getFeedbackByCourseId(course_detail.id);
    //console.log(feedback);
    const rating = await feedbackModel.getRatingByCourseId(course_detail.id)[0];

    const num_of_member = await coursesModel.countMemberByCourseID(course_detail.id)[0];

    res.render('vwCourse/course-detail', {
        course_detail,
        top5course,
        teacher,
        feedback,
        rating,
        num_of_member,
        layout: false
    });
});

module.exports = router;
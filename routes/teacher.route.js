const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const categoryModel = require('../models/categories.model');
const userModel = require('../models/user.model');
const authRole = require('../middlewares/auth.mdw');
const coursesModel = require('../models/courses.model');
const feedbackModel = require('../models/feedback.model');
const moment = require('moment');
const numeral = require('numeral');


const router = express.Router();

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

router.get('/', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        res.render("vwTeacher/index", {
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//course admin
router.get('/course', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        const courses = await courseModel.getCourseByTeacherId(req.session.authUser.id);

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwTeacher/course/list", {
            courses,
            err_message,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/course/add', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        const categories = await categoryModel.all();

        res.render("vwTeacher/course/add", {
            categories,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/add', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const newPositon = await courseModel.add({
            name: 'uknown',
            id_category: 0,
            status: 0
        });

        var filename;

        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/img/course')
            },
            filename: function(req, file, cb) {
                cb(null, newPositon.insertId.toString() + path.extname(file.originalname))
                filename = newPositon.insertId.toString() + path.extname(file.originalname);
            }
        });
        const upload = multer({ storage });
        upload.single('fuMain')(req, res, async function(err) {
            console.log(req.body);
            var currentdate = new Date();
            var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            await courseModel.patch({
                id: newPositon.insertId,
                name: req.body.txtName,
                price: +req.body.price,
                offer: +req.body.offer,
                creation_date: new Date(datetime),
                modification_date: new Date(datetime),
                id_category: +req.body.id_category,
                description: req.body.txtDes,
                status: 1,
                image: filename,
                short_description: req.body.txtShortDescription,
                iscomplete: 0,
            }, newPositon.insertId);

            await courseModel.addCourseTeacher({
                id_course: newPositon.insertId,
                id_teacher: req.session.authUser.id
            });

            fs.mkdir(`./public/video/${newPositon.insertId}`, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            })

            if (err) {
                console.log(err);
            } else {
                res.redirect(`/teacher/course/${newPositon.insertId}/editview`);
            }
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
})

router.get('/course/:id/addother', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const course = await courseModel.single(req.params.id);
        const chapter = await courseModel.getChapterByCourseId(req.params.id);
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
                lesson,
                id_course: req.params.id,
            });
        }

        var course_detail = {
            ...course,
            chapter_lesson
        }

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwTeacher/course/addchapter", {
            course_detail,
            err_message,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/addchapter', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const chapter = {
            name: req.body.txtName,
            id_course: req.params.id,
        }

        await courseModel.addChapter(chapter);

        req.session.err_message = "Thêm chương thành công.";

        console.log(req.body.edit);
        if (req.body.edit) {
            res.redirect(`/teacher/course/${req.params.id}/editview`);
        } else {
            res.redirect(`/teacher/course/${req.params.id}/addother`);
        }
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
})

router.post('/course/:id/addlesson', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const newPositon = await courseModel.addLesson({
            name: 'uknow',
            id_chapter: 1,
            status: 1
        });

        var videoname;

        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, `./public/video/${req.params.id}`)
            },
            filename: function(req, file, cb) {
                cb(null, newPositon.insertId.toString() + path.extname(file.originalname))
                videoname = newPositon.insertId.toString() + path.extname(file.originalname);
            }
        });
        const upload = multer({ storage });
        upload.single('fuMain')(req, res, async function(err) {
            console.log(req.body);
            var currentdate = new Date();
            var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            await courseModel.patchLesson({
                name: req.body.txtName,
                creation_date: new Date(datetime),
                modification_date: new Date(datetime),
                id_chapter: +req.body.id_chapter,
                content: req.body.txtDes,
                status: 1,
                video: videoname
            }, newPositon.insertId);

            if (err) {
                console.log(err);
            } else {
                req.session.err_message = "Thêm bài giảng thành công.";
                if (req.body.edit) {
                    res.redirect(`/teacher/course/${req.params.id}/editview`);
                } else {
                    res.redirect(`/teacher/course/${req.params.id}/addother`);
                }
            }
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }

})

router.get('/course/:id_course/edit', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id_course);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const id = req.params.id_course;
        const course = await courseModel.single(id);
        const mycategory = await categoryModel.single(course.id_category);
        const cat = await categoryModel.all();
        var categories = [];
        for (let i = 0; i < cat.length; i++) {
            if (mycategory.id != cat[i].id) {
                categories.push(cat[i]);
            }
        }

        var myIscomplete = {
            id: course.iscomplete,
            name: ''
        }

        if (course.iscomplete === 1) {
            myIscomplete.name = 'Đã hoàn thành'
        } else {
            myIscomplete.name = 'Chưa hoàn thành'
        }


        const comp = [
            { id: 0, name: 'Chưa hoàn thành' },
            { id: 1, name: 'Đã hoàn thành' }
        ];

        var isComplete = [];
        for (let i = 0; i < comp.length; i++) {
            if (myIscomplete.id != comp[i].id) {
                isComplete.push(comp[i]);
            }
        }
        isComplete = isComplete[0];

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwTeacher/course/edit", {
            course,
            mycategory,
            categories,
            myIscomplete,
            isComplete,
            err_message,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/edit', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, `./public/img/course`)
            },
            filename: function(req, file, cb) {
                cb(null, req.params.id.toString() + path.extname(file.originalname))
            }
        });
        const upload = multer({ storage });
        upload.single('fuMain')(req, res, async function(err) {
            var currentdate = new Date();
            var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            var course = {
                id: req.params.id,
                name: req.body.txtName,
                price: +req.body.price,
                offer: +req.body.offer,
                modification_date: new Date(datetime),
                id_category: +req.body.id_category,
                description: req.body.txtDes,
                status: 1,
                short_description: req.body.txtShortDescription,
                iscomplete: +req.body.is_complete,
            }

            await courseModel.patch(course, course.id);

            if (err) {
                console.log(err);
            } else {
                res.redirect(`/teacher/course/${course.id}/editview`);
            }
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }

});

router.get('/course/:id/editview', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const course = await courseModel.single(req.params.id);
        const chapter = await courseModel.getChapterByCourseId(req.params.id);
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
                lesson,
                id_course: req.params.id,
            });
        }

        var course_detail = {
            ...course,
            chapter_lesson,
            teacher,

        }

        course_detail.modification_date = moment(course_detail.modification_date).format('hh:mm:ss DD/MM/YYYY');
        course_detail.current_price = numeral(course_detail.price - course_detail.price * course_detail.offer / 100).format('0,0');
        course_detail.price = numeral(course_detail.price).format('0,0');

        const feedback = await feedbackModel.getFeedbackByCourseId(course_detail.id);
        //console.log(feedback);
        for (let i = 0; i < feedback.length; i++) {
            feedback[i].modification_date = moment(feedback[i].modification_date).format('HH:mm:ss DD/MM/YYYY');
            feedback[i].rating_star = createRating(i, feedback[i].rating, 'feedback');
        }
        const rating = (await feedbackModel.getRatingByCourseId(course_detail.id))[0];
        //console.log(rating.num_of_rating);
        const num_of_member = (await courseModel.countMemberByCourseID(course_detail.id))[0];

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwTeacher/course/editother_v2", {
            course_detail,
            err_message,
            layout: 'teacher.handlebars',
            feedback,
            rating,
            num_of_member,
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/course/:id/editchapter/:id_chapter', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const chapter = await courseModel.getChapterById(req.params.id_chapter);

        res.render("vwTeacher/course/editchapter", {
            chapter,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/editchapter/:id_chapter', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const chapter = {
            name: req.body.txtName,
            id_course: req.params.id,
        }

        await coursesModel.patchChapter(chapter, req.params.id_chapter);

        req.session.err_message = "Chỉnh sửa chương thành công.";
        res.redirect(`/teacher/course/${req.params.id}/editview`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const mychapter = await courseModel.getChapterById(req.params.id_chapter);
        const lesson = await courseModel.getLessonById(req.params.id_lesson);

        const chap = await courseModel.getChapterByCourseId(req.params.id);
        var chapters = [];
        for (let i = 0; i < chap.length; i++) {
            if (mychapter.id != chap[i].id) {
                chapters.push(chap[i]);
            }
        }

        res.render("vwTeacher/course/editlesson", {
            lesson,
            mychapter,
            chapters,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', authRole, async(req, res) => {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, `./public/video/${req.params.id}`)
            },
            filename: function(req, file, cb) {
                cb(null, req.params.id_lesson.toString() + path.extname(file.originalname))
            }
        });
        const upload = multer({ storage });
        upload.single('fuMain')(req, res, async function(err) {
            console.log(req.body);
            var currentdate = new Date();
            var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            await courseModel.patchLesson({
                name: req.body.txtName,
                modification_date: new Date(datetime),
                id_chapter: +req.body.id_chapter,
                content: req.body.txtDes,
                status: 1
            }, req.params.id_lesson);

            if (err) {
                console.log(err);
            } else {
                req.session.err_message = "Chỉnh sửa bài giảng thành công.";
                res.redirect(`/teacher/course/${req.params.id}/editview`);
            }
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }

});

router.post('/course/:id/delchapter/:id_chapter', authRole, async function(req, res) {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        const lesson = await courseModel.getLessonByChapterId(req.params.id_chapter);
        for (let i = 0; i < lesson.length; i++) {
            await courseModel.delLesson(lesson[i].id);
        }
        await courseModel.delChapter(req.params.id_chapter);
        req.session.err_message = "Xóa chương thành công.";
        res.redirect(`/teacher/course/${req.params.id}/editview`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/dellesson/:id_lesson', authRole, async function(req, res) {
    const teacher = await teacherModel.getTeacherByCourseId(req.params.id);
    var temp = false;
    for (let i = 0; i < teacher.length; i++) {
        if (teacher[i].id === req.session.authUser.id)
            temp = true;
    }
    if (req.session.isAuth && req.session.authUser.role === 2 && temp === true) {
        await courseModel.delLesson(req.params.id_lesson);
        req.session.err_message = "Xóa bài giảng thành công.";
        res.redirect(`/teacher/course/${req.params.id}/editview`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//info teacher admin
router.get('/info', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const teacher = await teacherModel.single(req.session.authUser.id);

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwTeacher/info/list", {
            teacher,
            err_message,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/info/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const teacher = await teacherModel.single(req.session.authUser.id);

        res.render("vwTeacher/info/edit", {
            teacher,
            layout: 'teacher.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/info/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        var teacher = {
            id: req.session.authUser.id,
            info: req.body.txtDes,
            status: 1
        }
        console.log(teacher);

        await teacherModel.patch(teacher, teacher.id);

        req.session.err_message = "Cập nhật thông tin giáo viên thành công.";
        res.redirect(`/teacher/info`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

module.exports = router;
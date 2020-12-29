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


const router = express.Router();

router.get('/', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        res.render("vwTeacher/index", {
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
    }
});

//course admin
router.get('/course', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        const courses = await courseModel.all();

        res.render("vwTeacher/course/list", {
            courses,
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
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
        res.redirect('/account/login');
    }
});

router.post('/course/add', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
        const newPositon = await courseModel.add({
            name: 'uknow',
            id_category: 0,
            status: 1
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
                name: req.body.txtName,
                price: +req.body.price,
                offer: +req.body.offer,
                creation_date: new Date(datetime),
                modification_date: new Date(datetime),
                id_category: +req.body.id_category,
                description: req.body.txtDes,
                status: 1,
                image: filename,
            }, newPositon.insertId);

            fs.mkdir(`./public/video/${newPositon.insertId}`, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            })

            if (err) {

            } else {
                res.redirect(`/teacher/course/${newPositon.insertId}/addother`);
            }
        });
    } else {
        res.redirect('/account/login');
    }
})

router.get('/course/:id/addother', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
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

        res.render("vwTeacher/course/addchapter", {
            course_detail,
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
    }
});

router.post('/course/:id/addchapter', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const chapter = {
            name: req.body.txtName,
            id_course: req.params.id,
        }

        await courseModel.addChapter(chapter);

        res.redirect(`/teacher/course/${req.params.id}/addother`);
    } else {
        res.redirect('/account/login');
    }
})

router.post('/course/:id/addlesson', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
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

            } else {
                res.redirect(`/teacher/course/${req.params.id}/addother`);
            }
        });
    } else {
        res.redirect('/account/login');
    }

})

router.get('/course/:id_course/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
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

        res.render("vwTeacher/course/edit", {
            course,
            mycategory,
            categories,
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
    }
});

router.post('/course/:id/edit', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 2) {
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
                status: 1
            }

            await courseModel.patch(course, course.id);

            if (err) {

            } else {
                res.redirect(`/teacher/course/${course.id}/editother`);
            }
        });
    } else {
        res.redirect('/account/login');
    }

});

router.get('/course/:id/editother', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
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

        res.render("vwTeacher/course/editother", {
            course_detail,
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
    }
});

router.get('/course/:id/editchapter/:id_chapter', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const chapter = await courseModel.getChapterById(req.params.id_chapter);

        res.render("vwTeacher/course/editchapter", {
            chapter,
            layout: 'teacher.handlebars'
        });
    } else {
        res.redirect('/account/login');
    }
});

router.post('/course/:id/editchapter/:id_chapter', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const chapter = {
            name: req.body.txtName,
            id_course: req.params.id,
        }

        await coursesModel.patchChapter(chapter, req.params.id_chapter);

        res.redirect(`/teacher/course/${req.params.id}/editother`);
    } else {
        res.redirect('/account/login');
    }
});

router.get('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
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
        res.redirect('/account/login');
    }
});

router.post('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 2) {
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

            } else {
                res.redirect(`/teacher/course/${req.params.id}/editother`);
            }
        });
    } else {
        res.redirect('/account/login');
    }

});

router.post('/course/:id/delchapter/:id_chapter', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const lesson = await courseModel.getLessonByChapterId(req.params.id_chapter);
        for (let i = 0; i < lesson.length; i++) {
            await courseModel.delLesson(lesson[i].id);
        }
        await courseModel.delChapter(req.params.id_chapter);
        res.redirect(`/teacher/course/${req.params.id}/editother`);
    } else {
        res.redirect('/account/login');
    }
});

router.post('/course/:id/dellesson/:id_lesson', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        await courseModel.delLesson(req.params.id_lesson);
        res.redirect(`/teacher/course/${req.params.id}/editother`);
    } else {
        res.redirect('/account/login');
    }
});

router.post('/course/:id/del', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 2) {
        const chapter = await courseModel.getChapterByCourseId(req.params.id);

        for (let i = 0; i < chapter.length; i++) {
            const lesson = await courseModel.getLessonByChapterId(chapter[i].id);
            for (let i = 0; i < lesson.length; i++) {
                await courseModel.delLesson(lesson[i].id);
            }
            await courseModel.delChapter(chapter[i].id);
        }

        await courseModel.del(req.params.id);
        res.redirect(`/teacher/course`);
    } else {
        res.redirect('/account/login');
    }
});

module.exports = router;
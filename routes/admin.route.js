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
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


const router = express.Router();

router.get('/', async(req, res) => {

    res.render("vwAdmin/index", {
        layout: 'admin.handlebars'
    });
});


//category admin
router.get('/category', async(req, res) => {

    const categories = await categoryModel.all();
    console.log(categories);

    res.render("vwAdmin/category/list", {
        categories,
        layout: 'admin.handlebars'
    });
});

router.get('/category/add', async(req, res) => {

    const categories = await categoryModel.all();

    res.render("vwAdmin/category/add", {
        categories,
        layout: 'admin.handlebars'
    });
});

router.post('/category/add', async(req, res) => {

    var cat = {
        name: req.body.txtName,
        id_parent: req.body.parent,
        url: req.body.txtUrl,
    }

    await categoryModel.add(cat);

    res.redirect('/admin/category');
});

router.get('/category/:id_category/edit', async(req, res) => {
    const id = req.params.id_category;
    const category = await categoryModel.single(id);
    const parent = await categoryModel.single(category.id_parent);
    if (parent === null) {
        parent_name = 'Không có';
    } else {
        parent_name = parent.name;
    }
    const cat = await categoryModel.all();
    var categories = [];
    for (let i = 0; i < cat.length; i++) {
        if (category.id_parent != cat[i].id) {
            categories.push(cat[i]);
        }
    }

    res.render("vwAdmin/category/edit", {
        category,
        parent_name,
        categories,
        layout: 'admin.handlebars'
    });
});

router.post('/category/:id_category/edit', async(req, res) => {

    var cat = {
        id: +req.body.txtId,
        name: req.body.txtName,
        id_parent: req.body.parent,
        url: req.body.txtUrl,
    }

    await categoryModel.patch(cat);

    res.redirect(`/admin/category/${cat.id}/edit`);
});

//course admin
router.get('/course', async(req, res) => {

    const courses = await courseModel.all();

    res.render("vwAdmin/course/list", {
        courses,
        layout: 'admin.handlebars'
    });
});

router.get('/course/add', async(req, res) => {

    const categories = await categoryModel.all();

    res.render("vwAdmin/course/add", {
        categories,
        layout: 'admin.handlebars'
    });
});

router.post('/course/add', async(req, res) => {

    const newPositon = await courseModel.add({
        name: 'uknow',
        id_category: 0,
        status: 1
    });

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/img/course')
        },
        filename: function(req, file, cb) {
            cb(null, newPositon.insertId.toString() + path.extname(file.originalname))
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
            modification_date: new Date(datetime),
            id_category: +req.body.id_category,
            description: req.body.txtDes,
            status: 1
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
            res.redirect(`/admin/course/${newPositon.insertId}/addother`);
        }
    });
})

router.get('/course/:id/addother', async(req, res) => {
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

    res.render("vwAdmin/course/addchapter", {
        course_detail,
        layout: 'admin.handlebars'
    });
});

router.post('/course/:id/addchapter', async(req, res) => {
    const chapter = {
        name: req.body.txtName,
        id_course: req.params.id,
    }

    await courseModel.addChapter(chapter);

    res.redirect(`/admin/course/${req.params.id}/addother`)
})

router.post('/course/:id/addlesson', async(req, res) => {

    const newPositon = await courseModel.addLesson({
        name: 'uknow',
        id_chapter: 1,
        status: 1
    });

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, `./public/video/${req.params.id}`)
        },
        filename: function(req, file, cb) {
            cb(null, newPositon.insertId.toString() + path.extname(file.originalname))
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
        }, newPositon.insertId);

        if (err) {

        } else {
            res.redirect(`/admin/course/${req.params.id}/addother`);
        }
    });
})

router.get('/course/:id_course/edit', async(req, res) => {
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

    res.render("vwAdmin/course/edit", {
        course,
        mycategory,
        categories,
        layout: 'admin.handlebars'
    });
});

router.post('/course/:id/edit', async(req, res) => {

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
            res.redirect(`/admin/course/${course.id}/editother`);
        }
    });

});

router.get('/course/:id/editother', async(req, res) => {
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

    res.render("vwAdmin/course/editother", {
        course_detail,
        layout: 'admin.handlebars'
    });
});

router.get('/course/:id/editchapter/:id_chapter', async(req, res) => {
    const chapter = await courseModel.getChapterById(req.params.id_chapter);

    res.render("vwAdmin/course/editchapter", {
        chapter,
        layout: 'admin.handlebars'
    });
});

router.post('/course/:id/editchapter/:id_chapter', async(req, res) => {
    const chapter = {
        name: req.body.txtName,
        id_course: req.params.id,
    }

    await coursesModel.patchChapter(chapter, req.params.id_chapter);

    res.redirect(`/admin/course/${req.params.id}/editother`);
});

router.get('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', async(req, res) => {
    const mychapter = await courseModel.getChapterById(req.params.id_chapter);
    const lesson = await courseModel.getLessonById(req.params.id_lesson);

    const chap = await courseModel.getChapterByCourseId(req.params.id);
    var chapters = [];
    for (let i = 0; i < chap.length; i++) {
        if (mychapter.id != chap[i].id) {
            chapters.push(chap[i]);
        }
    }

    res.render("vwAdmin/course/editlesson", {
        lesson,
        mychapter,
        chapters,
        layout: 'admin.handlebars'
    });
});

router.post('/course/:id/chapter/:id_chapter/editlesson/:id_lesson', async(req, res) => {

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
            res.redirect(`/admin/course/${req.params.id}/editother`);
        }
    });

});

router.post('/course/:id/delchapter/:id_chapter', async function(req, res) {
    const lesson = await courseModel.getLessonByChapterId(req.params.id_chapter);
    for (let i = 0; i < lesson.length; i++) {
        await courseModel.delLesson(lesson[i].id);
    }
    await courseModel.delChapter(req.params.id_chapter);
    res.redirect(`/admin/course/${req.params.id}/editother`);
});

router.post('/course/:id/dellesson/:id_lesson', async function(req, res) {
    await courseModel.delLesson(req.params.id_lesson);
    res.redirect(`/admin/course/${req.params.id}/editother`);
});

router.post('/course/:id/del', async function(req, res) {
    const chapter = await courseModel.getChapterByCourseId(req.params.id);

    for (let i = 0; i < chapter.length; i++) {
        const lesson = await courseModel.getLessonByChapterId(chapter[i].id);
        for (let i = 0; i < lesson.length; i++) {
            await courseModel.delLesson(lesson[i].id);
        }
        await courseModel.delChapter(chapter[i].id);
    }

    await courseModel.del(req.params.id);
    res.redirect(`/admin/course`);
});

//user admin
router.get('/user', async(req, res) => {

    const user = await userModel.all();

    res.render("vwAdmin/user/list", {
        user,
        layout: 'admin.handlebars'
    });
});

router.get('/user/:id/edit', async(req, res) => {

    const user = await userModel.single(req.params.id);
    const temp = [
        { id: 1, name: 'Học viên' },
        { id: 2, name: 'Giáo viên' },
        { id: 3, name: 'Quản trị viên' }
    ];
    const role = [];
    var myrole = {};
    for (let i = 0; i < temp.length; i++) {
        if (temp[i].id !== user.role) {
            role.push(temp[i]);
        } else {
            myrole = {
                id: temp[i].id,
                name: temp[i].name,
            };
        }
    }

    res.render("vwAdmin/user/edit", {
        user,
        myrole,
        role,
        layout: 'admin.handlebars'
    });
});

router.post('/user/:id/edit', async(req, res) => {
    var currentdate = new Date();
    var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    var user = {
        fullname: req.body.txtName,
        username: req.body.txtUsername,
        phone: req.body.txtPhone,
        role: +req.body.role,
        email: req.body.txtEmail,
        modification_date: new Date(datetime),
    }

    await userModel.patch(user, req.params.id);

    res.redirect(`/admin/user/${req.params.id}/edit`);
});

router.post('/user/:id/del', async function(req, res) {

    await userModel.delUserEnrollCourse(req.params.id);
    await userModel.delUserFeedback(req.params.id);
    await userModel.delUserTeacher(req.params.id);

    await userModel.del(req.params.id);

    res.redirect(`/admin/user`);
});

//teacher admin
router.get('/teacher', async(req, res) => {

    const teacher = await teacherModel.all();

    res.render("vwAdmin/teacher/list", {
        teacher,
        layout: 'admin.handlebars'
    });
});

router.get('/teacher/:id/edit', async(req, res) => {

    const teacher = await teacherModel.single(req.params.id);

    res.render("vwAdmin/teacher/edit", {
        teacher,
        layout: 'admin.handlebars'
    });
});

router.post('/teacher/:id/edit', async(req, res) => {
    var currentdate = new Date();
    var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    var user = {
        id: req.params.id,
        fullname: req.body.txtName,
        username: req.body.txtUsername,
        phone: req.body.txtPhone,
        email: req.body.txtEmail,
        modification_date: new Date(datetime),
    }

    var teacher = {
        id: req.body.id,
        info: req.body.txtInfo,
    }

    await userModel.patch(user, user.id);
    await teacherModel.patch(teacher, teacher.id);

    res.redirect(`/admin/teacher/${req.params.id}/edit`);
});

router.post('/teacher/:id/del', async function(req, res) {

    const teacher = {
        id: req.params.id,
        role: 1,
    }
    await userModel.patch(teacher, teacher.id);
    await teacherModel.patch({
        id: teacher.id,
        status: 0,
    }, teacher.id)

    res.redirect(`/admin/teacher`);
});

router.get('/teacher/add', async(req, res) => {

    const teacher = await teacherModel.getApplyTeacher();

    res.render("vwAdmin/teacher/add", {
        teacher,
        layout: 'admin.handlebars'
    });
});

router.post('/teacher/add', async(req, res) => {

    const teacher = {
        id: +req.body.txtId,
        info: req.body.txtInfo,
        status: 1,
    }

    const user = {
        id: +req.body.txtId,
        role: 2,
    }

    await teacherModel.add(teacher);
    await userModel.patch(user, user.id);
    await teacherModel.delApply(user.id);

    res.redirect('/admin/teacher/add');
});

module.exports = router;
const express = require('express');
const multer = require('multer');
var path = require('path');

const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const categoryModel = require('../models/categories.model');
const userModel = require('../models/user.model');
const authRole = require('../middlewares/auth.mdw');


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
            creation_date: new Date(datetime),
            modification_date: new Date(datetime),
            id_category: +req.body.id_category,
            description: req.body.txtDes,
            status: 1
        }, newPositon.insertId);

        if (err) {

        } else {
            res.redirect('/admin/course');
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
            lesson
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
            creation_date: new Date(datetime),
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

//user admin
router.get('/user', async(req, res) => {

    const user = await userModel.all();

    res.render("vwAdmin/user/list", {
        user,
        layout: 'admin.handlebars'
    });
});

//teacher admin
router.get('/teacher', async(req, res) => {

    const teacher = await teacherModel.all();

    res.render("vwAdmin/teacher/list", {
        teacher,
        layout: 'admin.handlebars'
    });
});

module.exports = router;
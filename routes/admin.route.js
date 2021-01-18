const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const categoryModel = require('../models/categories.model');
const userModel = require('../models/user.model');
const authRole = require('../middlewares/auth.mdw');


const router = express.Router();

router.get('/', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 3) {
        res.render("vwAdmin/index", {
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});


//category admin
router.get('/category', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const categories = await categoryModel.all();
        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/category/list", {
            categories,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/category/add', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 3) {
        const categories = await categoryModel.all();

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/category/add", {
            categories,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/category/add', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 3) {
        var cat = {
            name: req.body.txtName,
            id_parent: req.body.parent,
            url: req.body.txtUrl,
        }

        await categoryModel.add(cat);

        res.redirect('/admin/category');
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }

});

router.get('/category/:id_category/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
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

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/category/edit", {
            category,
            parent_name,
            categories,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/category/:id_category/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        var catobj = {
            id: +req.body.txtId,
            name: req.body.txtName,
            id_parent: req.body.parent,
            url: req.body.txtUrl,
        }

        if (await categoryModel.patch(catobj)) {
            req.session.err_message = 'Thay đổi danh mục thành công.';
        } else {
            req.session.err_message = 'Thay đổi danh mục thất bại.';
        }

        res.redirect(`/admin/category`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//del category
router.post('/category', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const course = await courseModel.getCountCourseByCatId(+req.body.id);
        if (course > 0) {
            req.session.err_message = 'Xóa danh mục thất bại. Danh mục đã có khóa học.';
        } else {
            var flag = false;
            child = await categoryModel.getChildrenCategory(+req.body.id);
            for (let i = 0; i < child.length; i++) {
                if (await courseModel.getCountCourseByCatId(child[i].id) > 0) {
                    flag = true;
                    break;
                }
            }
            if (flag === false) {
                await categoryModel.del(+req.body.id);
                req.session.err_message = 'Xóa danh mục thành công.';
            } else {
                req.session.err_message = 'Xóa danh mục thất bại. Danh mục có danh mục con.';
            }

        }

        res.redirect(`/admin/category`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//course admin
router.get('/course', authRole, async(req, res) => {

    if (req.session.isAuth && req.session.authUser.role === 3) {
        const course = await courseModel.all();
        var courses = [];
        for (let i = 0; i < course.length; i++) {
            courses.push({
                ...course[i],
                teacher: await teacherModel.getTeacherByCourseId(course[i].id),
                category: await categoryModel.getCategoryByCourseId(course[i].id)
            })
        }

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/course/list", {
            courses,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/course/:id/del', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        // const chapter = await courseModel.getChapterByCourseId(req.params.id);

        // for (let i = 0; i < chapter.length; i++) {
        //     const lesson = await courseModel.getLessonByChapterId(chapter[i].id);
        //     for (let i = 0; i < lesson.length; i++) {
        //         await courseModel.delLesson(lesson[i].id);
        //     }
        //     await courseModel.delChapter(chapter[i].id);
        // }

        if (await courseModel.del(req.params.id)) {
            req.session.err_message = 'Đình chỉ khóa học thành công.'
        } else {
            req.session.err_message = 'Đình chỉ khóa học thất bại.'
        }

        res.redirect(`/admin/course`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//user admin
router.get('/user', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const user = await userModel.allStudent();

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/user/list", {
            user,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/user/:id/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const user = await userModel.single(req.params.id);
        const temp = [
            { id: 1, name: 'Hoạt động' },
            { id: 0, name: 'Bị đình chỉ' },
        ];
        const status = [];
        var mystatus = {};
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id !== user.status) {
                status.push(temp[i]);
            } else {
                mystatus = temp[i];
            }
        }

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/user/edit", {
            user,
            mystatus,
            status,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/user/:id/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        var userObj = {
            fullname: req.body.txtName,
            username: req.body.txtUsername,
            phone: req.body.txtPhone,
            status: +req.body.status,
            email: req.body.txtEmail,
            modification_date: new Date(datetime),
        }

        if (await userModel.patch(userObj, req.params.id)) {
            if (userObj.role == 2) {
                await teacherModel.patch({ status: 1 }, req.params.id)
            }
            req.session.err_message = "Cập nhật học viên thành công."
        } else {
            req.session.err_message = "Cập nhật học viên thất bại."
        }

        res.redirect(`/admin/user`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/user/:id/del', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        await userModel.delUserEnrollCourse(req.params.id);
        await userModel.delUserFeedback(req.params.id);

        await userModel.patch({ status: 0 }, req.params.id);

        req.session.err_message = 'Vô hiệu hóa học viên thành công.',

            res.redirect(`/admin/user`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

//teacher admin
router.get('/teacher', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const teacher = await teacherModel.all();

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/teacher/list", {
            teacher,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/teacher/:id/edit', async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const teacher = await teacherModel.single(req.params.id);

        const temp = [
            { id: 1, name: 'Hoạt động' },
            { id: 0, name: 'Bị đình chỉ' },
        ];
        const status = [];
        var mystatus = {};
        for (let i = 0; i < temp.length; i++) {
            console.log(teacher);
            if (temp[i].id !== teacher.teacherstatus) {
                status.push(temp[i]);
            } else {
                mystatus = temp[i];
            }
        }

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/teacher/edit", {
            teacher,
            status,
            mystatus,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/teacher/:id/edit', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
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
            id: req.params.id,
            info: req.body.txtInfo,
            status: +req.body.status,
        }

        if (await userModel.patch(user, user.id) && await teacherModel.patch(teacher, teacher.id)) {
            req.session.err_message = "Cập nhật giáo viên thành công.";
        } else {
            req.session.err_message = "Cập nhật giáo viên thất bại.";
        }

        res.redirect(`/admin/teacher`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/teacher/:id/del', authRole, async function(req, res) {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const teacher = {
            id: req.params.id,
            role: 3,
        }

        if (await teacherModel.patch({
                id: teacher.id,
                status: 0,
            }, teacher.id)) {
            req.session.err_message = "Vô hiệu hóa giáo viên thành công.";
        } else {
            req.session.err_message = "Vô hiệu quá giáo viên thất bại.";
        }

        res.redirect(`/admin/teacher`);
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.get('/teacher/add', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
        const teacher = await teacherModel.getApplyTeacher();

        const err_message = req.session.err_message;
        req.session.err_message = null;

        res.render("vwAdmin/teacher/add", {
            teacher,
            err_message,
            layout: 'admin.handlebars'
        });
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

router.post('/teacher/add', authRole, async(req, res) => {
    if (req.session.isAuth && req.session.authUser.role === 3) {
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

        req.session.err_message = "Thêm giáo viên thành công.";

        res.redirect('/admin/teacher/add');
    } else {
        req.session.err_message = 'Bạn không có quyền ở chức năng này';
        res.redirect(`/account/login`);
    }
});

module.exports = router;
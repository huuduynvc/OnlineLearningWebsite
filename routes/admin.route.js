const express = require('express');

const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const categoryModel = require('../models/categories.model');
const authRole = require('../middlewares/auth.mdw');


const router = express.Router();

router.get('/', async(req, res) => {

    res.render("vwAdmin/index", {
        layout: 'admin.handlebars'
    });
});

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



module.exports = router;
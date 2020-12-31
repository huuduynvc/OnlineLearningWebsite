const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser');
const userModel = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/login', async function(req, res) {
    if (req.headers.referer) {
        req.session.retUrl = req.headers.referer;
    }
    res.render('vwAccount/login', {
        layout: false,
    });
})

router.post('/login', async function(req, res) {
    const user = await userModel.singleByUserName(req.body.username);
    if (user === null || user === '') {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Sai tên người dùng hoặc mật khẩu.'
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Sai tên người dùng hoặc mật khẩu.'
        });
    }

    req.session.isAuth = true;
    req.session.authUser = user;

    let url = req.session.retUrl || '/';
    res.redirect(url);

})

router.post('/logout', async function(req, res) {
    req.session.isAuth = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
})

router.get('/register', async function(req, res) {
    res.render('vwAccount/register', {
        layout: false
    });
})

router.post('/register', async function(req, res) {

    const hash = bcrypt.hashSync(req.body.txtPassword, 10);
    var currentdate = new Date();
    var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    const user = {
        username: req.body.txtUsername,
        password: hash,
        fullname: req.body.txtName,
        email: req.body.txtEmail,
        creation_date: new Date(datetime),
        modification_date: new Date(datetime),
        role: 1,
        status: 1,
        phone: req.body.txtPhone
    }

    try {
        await userModel.add(user);
    } catch (e) {
        console.error(e);

        res.render('vwAccount/register', {
            layout: false,
            err_message: 'Đăng kí thất bại !'
        });

    }

    req.session.isAuth = true;
    req.session.authUser = await userModel.singleByUserName(user.username);

    let url = req.session.retUrl || '/';
    res.redirect(url);

})

router.get('/username/is-available', async function(req, res) {
    const username = req.query.user;
    const user = await userModel.singleByUserName(username);
    if (user === null) {
        return res.json(true);
    }

    res.json(false);
})

router.get('/email/is-available', async function(req, res) {
    const email = req.query.email;
    const result = await userModel.singleByEmail(email);
    if (result === null) {
        return res.json(true);
    }

    res.json(false);
})

// router.get('/profile', auth, async function(req, res) {
//     res.render('vwAccount/profile');
// })

module.exports = router;
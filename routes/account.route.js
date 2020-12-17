const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser');
const userModel = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/login', async function(req, res) {
    // if (req.headers.referer) {
    //     req.session.retUrl = ref;
    // }
    res.render('vwAccount/login', {
        layout: false
    });
})

router.post('/login', async function(req, res) {
    const user = await userModel.singleByUserName(req.body.username);
    if (user === null) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Invalid username or password.'
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Invalid username or password.'
        });
    }

    req.session.isAuth = true;
    req.session.authUser = user;

    let url = req.session.retUrl || '/';
    console.log('123');
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

// var ID = function() {
//     // Math.random should be unique because of its seeding algorithm.
//     // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//     // after the decimal.
//     return '_' + Math.random().toString(36).substr(2, 9);
// };

router.post('/register', async function(req, res) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    const user = {
        // id: ID(),
        username: req.body.username,
        password: hash,
        birthday: dob,
        fullname: req.body.name,
        email: req.body.email,
        creation_date: new Date(datetime),
        modification_date: new Date(datetime),
        role: 1,
        status: 1
    }

    await userModel.add(user);
    res.render('vwAccount/register', {
        layout: false
    });
})

router.get('/is-available', async function(req, res) {
    const username = req.query.user;
    const user = await userModel.singleByUserName(username);
    if (user === null) {
        return res.json(true);
    }

    res.json(false);
})

// router.get('/profile', auth, async function(req, res) {
//     res.render('vwAccount/profile');
// })

module.exports = router;
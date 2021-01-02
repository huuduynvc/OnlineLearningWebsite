const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser');
const userModel = require('../models/user.model');
const courseModel = require('../models/courses.model');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();
const numeral = require('numeral');
const teacherModel = require('../models/teacher.model');
const feedbackModel = require('../models/feedback.model');
const multer = require('multer');
const path = require('path');
const { isBuffer } = require('util');

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
    if (user === null) {
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

router.get('/profile', auth, async function(req, res) {
    const user = await userModel.single(req.session.authUser.id);
    var role;
    if (user.role === 1) {
        role = 'Học viên';
    } else if (user.role === 2) {
        role = 'Giáo viên';
    } else {
        role = 'Quản trị viên'
    }
    res.render('vwAccount/profile', {
        user,
        role,
        layout: 'sub.handlebars'
    });
})

router.post('/profile', auth, async function(req, res) {

    var filename;
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/img/user')
        },
        filename: function(req, file, cb) {
            cb(null, (req.session.authUser.id).toString() + path.extname(file.originalname))
            filename = (req.session.authUser.id).toString() + path.extname(file.originalname);
        }
    });
    const upload = multer({ storage });
    upload.single('fuMain')(req, res, async function(err) {
        console.log(filename == undefined)
        if (filename == undefined) {
            filename = (await userModel.single(req.session.authUser.id)).avatar;
        }
        var currentdate = new Date();
        var datetime = "" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        const user = {
            id: req.session.authUser.id,
            fullname: req.body.txtName,
            email: req.body.txtEmail,
            phone: req.body.txtPhone,
            modification_date: new Date(datetime),
            avatar: filename
        }

        await userModel.patch(user, user.id);

        if (err) {
            console.log(err);
        } else {
            res.redirect('/account/profile');
        }
    });

})

router.get('/changepassword', auth, async function(req, res) {
    const user = await userModel.single(req.session.authUser.id);
    var role;
    if (user.role === 1) {
        role = 'Học viên';
    } else if (user.role === 2) {
        role = 'Giáo viên';
    } else {
        role = 'Quản trị viên'
    }
    res.render('vwAccount/changepassword', {
        user,
        role,
        layout: 'sub.handlebars'
    });
})

router.post('/changepassword', auth, async function(req, res) {
    const user = await userModel.single(req.session.authUser.id);
    var role;
    if (user.role === 1) {
        role = 'Học viên';
    } else if (user.role === 2) {
        role = 'Giáo viên';
    } else {
        role = 'Quản trị viên'
    }
    const rel = bcrypt.compareSync(req.body.txtPassword, user.password);
    var err_message;
    if (rel) {
        pass = {
            password: bcrypt.hashSync(req.body.txtNewpass, 10)
        }
        await userModel.patch(pass, req.session.authUser.id);
        err_message = 'Thay đổi mật khẩu thành công.'
    } else {
        err_message = 'Sai mật khẩu cũ. Vui lòng thử lại.'
    }
    res.render('vwAccount/changepassword', {
        user,
        role,
        err_message,
        layout: 'sub.handlebars'
    });

})

router.get('/watchlist', auth, async function(req, res) {
    const user = await userModel.single(req.session.authUser.id);
    var role;
    if (user.role === 1) {
        role = 'Học viên';
    } else if (user.role === 2) {
        role = 'Giáo viên';
    } else {
        role = 'Quản trị viên';
    }

    const courses = await userModel.getWatchList(req.session.authUser.id);
    var watchlist = [];
    for (let i = 0; i < courses.length; i++) {
        watchlist.push({
            id: courses[i].id,
            name: courses[i].name,
            catname: courses[i].catname,
            rating: numeral(courses[i].rating).format('0,0'),
            rating_star: createRating(i, courses[i].rating, 'watchlist'),
            num_of_rating: courses[i].num_of_rating,
            image: courses[i].image,
            current_price: numeral(courses[i].price - courses[i].price * courses[i].offer / 100).format('0,0'),
            price: numeral(courses[i].price).format('0,0'),
            offer: courses[i].offer,
            teacher: await teacherModel.getTeacherByCourseId(courses[i].id)
        });
    }

    res.render('vwAccount/watchlist', {
        user,
        role,
        watchlist,
        layout: 'sub.handlebars'
    });
})


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

module.exports = router;
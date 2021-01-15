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
const nodeMailer = require('../models/sendMail.model');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/login', async function(req, res) {
    if (!(req.headers.referer + "").includes("register", 0)) {
        req.session.retUrl = req.headers.referer;
    }
    const err_message = req.session.err_message;
    req.session.err_message = null;
    res.render('vwAccount/login', {
        err_message,
        layout: false,
    });
})

router.post('/login', async function(req, res) {
    const user = await userModel.singleByUserName(req.body.username);
    if (user === null) {
        req.session.err_message = 'Sai tên người dùng hoặc mật khẩu.';
        return res.redirect('/account/login');
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        req.session.err_message = 'Sai tên người dùng hoặc mật khẩu.';
        return res.redirect('/account/login');
    }

    req.session.isAuth = true;
    req.session.authUser = user;
    if (user.role === 2) {
        req.session.authUser.isTeacher = true;
    } else if (user.role === 3) {
        req.session.authUser.isAdmin = true;
    }

    let url = req.session.retUrl || '/';
    res.redirect(url);

})

router.post('/logout', async function(req, res) {
    req.session.isAuth = false;
    req.session.authUser = null;

    res.redirect(req.headers.referer);
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

router.get('/buylist', auth, async function(req, res) {
    const user = await userModel.single(req.session.authUser.id);
    var role;
    if (user.role === 1) {
        role = 'Học viên';
    } else if (user.role === 2) {
        role = 'Giáo viên';
    } else {
        role = 'Quản trị viên';
    }

    const courses = await userModel.getBuyList(req.session.authUser.id);
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
            iscomplete: courses[i].iscomplete,
            teacher: await teacherModel.getTeacherByCourseId(courses[i].id)
        });
    }

    res.render('vwAccount/buylist', {
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

router.get('/delwatchlist/:id_course', auth, async function(req, res) {
    await userModel.delWatchList(req.session.authUser.id, +req.params.id_course);
    let url = req.session.retUrl || '/';
    res.redirect(url);
})

router.get('/addwatchlist/:id_course', auth, async function(req, res) {
    await userModel.addWatchList({
        id_user: req.session.authUser.id,
        id_course: +req.params.id_course
    });

    let url = req.session.retUrl || '/';
    res.redirect(url);
})

router.get('/watchlist/is-available', auth, async function(req, res) {
    const result = await userModel.singleByIdUserAndIdCourse(req.session.authUser.id, req.query.id_course);
    if (result === null) {
        return res.json(true);
    }

    res.json(false);
})

router.get('/register', async function(req, res) {
    const err_message = req.session.err_message;
    req.session.err_message = null;

    res.render('vwAccount/register', {
        err_message,
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
        status: 0,
        phone: req.body.txtPhone
    }

    if (await userModel.add(user)) {

        const data = nodeMailer.sendOTP(user.email);

        //render view
        req.session.isVerificated = true;
        req.session.VerifyUser = data;

        return res.redirect(`/account/sendOTP`);
    } else {
        req.session.err_message = 'Đăng kí thất bại !';
        res.redirect(`/account/register`);
    }
})

router.get('/sendOTP', async function(req, res) {
    const err_message = req.session.err_message;
    req.session.err_message = null;

    const confirmOK = req.session.confirmOK;
    req.session.confirmOK = null;

    res.render('vwAccount/confirmEmailOTP', {
        email: req.session.VerifyUser.email,
        err_message,
        confirmOK,
        layout: 'sub.handlebars'
    });
})

router.post('/sendOTP', async(req, res) => {
    console.log(req.body);
    console.log(req.session.VerifyUser);
    //check otp code
    if (!(req.body.otp === req.session.VerifyUser.otp)) {
        req.session.err_message = 'Mã OTP của bạn không trùng khớp. Vui lòng nhập lại.';

        return res.redirect(`/account/sendOTP`);
    }

    //is verificated account
    if (req.session.isVerificated === true) {
        const entity = {
            email: req.session.VerifyUser.email,
            status: 1,
        };

        const result = await userModel.patchByEmail(entity);
        req.session.err_message = 'Tài khoản đã được kích hoạt thành công. Bạn có thể đăng nhập để tiếp tục sử dụng';

        req.session.confirmOK = true;
        return res.redirect(`/account/sendOTP`);
    }
})

router.get('/resend', (req, res) => {
    const data = nodeMailer.sendOTP(req.session.VerifyUser.email);
    //render view
    req.session.VerifyUser.otp = data.otp;

    req.session.err_message = "Mã OTP mới đã được gửi đến tài khoản email của bạn."
    return res.redirect(`/account/sendOTP`);
})

module.exports = router;
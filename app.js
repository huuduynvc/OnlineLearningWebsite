//require module
const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const categoryModel = require('./models/categories.model');
const courseModel = require('./models/courses.model');
const teacherModel = require('./models/teacher.model');
const userModel = require('./models/user.model');
//create app
const app = express();


//use module
app.use(express.static('public'));
app.use(express.static('config'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

//set nescessary
app.set("views", "./views");
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    helpers: {
        section: hbs_sections(),
        //format: val => numeral(val).format('0,0'),
    }
}));
app.set('view engine', 'hbs');

require('./middlewares/routes.mdw')(app);


function getMenu(data, id_find) {
    return (function(arr) {
        for (var i = 0; i < data.length; i++) {
            (function(item) {
                if (!item || item.id_parent != id_find || !item.id || !item.name) return;
                item = (function(json) {
                    var sub = getMenu(data, json.id);
                    if (sub.length > 0) json.sub = sub;
                    return json;
                })({
                    id: item.id,
                    name: item.name,
                    url: item.url
                });
                return arr.push(item);
            })(data[i]);
        }
        return arr;
    })([])
}

function addCategories(obj) {
    htmlBuilder = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].sub != null)
            htmlBuilder += '<li class="nav-item dropdown">' +
            `<a class="nav-link dropdown-toggle" href="${obj[i].url}" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  ${obj[i].name}
</a>`;
        else
            htmlBuilder += '<li class="nav-item active">' +
            `<a class="nav-link" href="${obj[i].url}">${obj[i].name}</a>`;

        if (obj[i].sub != null) {
            htmlBuilder += '<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
            htmlBuilder += addCategories(obj[i].sub);
            htmlBuilder += '</ul>';
        }
        htmlBuilder += '</li>';
    }

    return htmlBuilder;
}


//render view
app.get("/", async(req, res) => {
    const categories = await categoryModel.all();
    const topCat = await categoryModel.top6CatMostEnrollWeek();
    const topCourseNew = await courseModel.top10Newest();
    var topNew1 = [];
    var topNew2 = [];
    for (let i = 0; i < 5; i++) {
        topNew1.push({
            id: topCourseNew[i].id,
            name: topCourseNew[i].name,
            caturl: topCourseNew[i].caturl,
            catname: topCourseNew[i].catname,
            rating: topCourseNew[i].rating,
            num_of_rating: topCourseNew[i].num_of_rating,
            img: topCourseNew[i].image,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topCourseNew[i].price),
            offer: topCourseNew[i].offer,
            current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100),
            teacher: await teacherModel.getTeacherByCourseId(topCourseNew[i].id)
        });
    }
    for (let i = 5; i < 10; i++) {
        topNew2.push({
            id: topCourseNew[i].id,
            name: topCourseNew[i].name,
            caturl: topCourseNew[i].caturl,
            catname: topCourseNew[i].catname,
            rating: topCourseNew[i].rating,
            num_of_rating: topCourseNew[i].num_of_rating,
            img: topCourseNew[i].image,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topCourseNew[i].price),
            offer: topCourseNew[i].offer,
            current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topCourseNew[i].price - topCourseNew[i].price * topCourseNew[i].offer / 100),
            teacher: await teacherModel.getTeacherByCourseId(topCourseNew[i].id)
        });
    }

    console.log((await userModel.countUser())[0]);
    console.log(await userModel.countTeacher()[0]);

    const catObj = getMenu(categories, 0);
    const html = addCategories(catObj);

    res.render("home", {
        menu: html,
        topCat: topCat,
        topNew1: topNew1,
        topNew2: topNew2,
        countUser: (await userModel.countUser())[0],
        countTeacher: (await userModel.countTeacher())[0],
        countHappies: (await userModel.countHappies())[0]
    });
})

//run server in port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
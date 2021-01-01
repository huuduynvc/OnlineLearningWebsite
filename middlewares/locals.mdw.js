const categoryModel = require('../models/categories.model');

module.exports = function(app) {
    app.use(async function(req, res, next) {
        if (typeof(req.session.isAuth) === 'undefined') {
            req.session.isAuth = false;
        }

        res.locals.isAuth = req.session.isAuth;
        res.locals.authUser = req.session.authUser;
        next();
    })

    app.use(async function(req, res, next) {
        const categories = await categoryModel.all();
        const catObj = getMenu(categories, 0);
        const html = addCategories(catObj);
        res.locals.menu = html;
        next();
    })

    app.use(async function(req, res, next) {
        res.locals.fcat = await categoryModel.top5CatMostEnroll();
        next();
    })
}

function addCategories(obj) {
    htmlBuilder = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].sub != null)
            htmlBuilder += '<li class="nav-item active dropdown">' +
            `<a class="nav-link dropdown-toggle" href="${obj[i].url}" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  ${obj[i].name}
</a>`;
        else
            htmlBuilder += '<li class="nav-item active">' +
            `<a class="nav-link" href="${obj[i].url}">${obj[i].name}</a>`;

        if (obj[i].sub != null) {
            htmlBuilder += '<ul class="dropdown-menu submenu" aria-labelledby="navbarDropdownMenuLink">';
            htmlBuilder += addCategories(obj[i].sub);
            htmlBuilder += '</ul>';
        }
        htmlBuilder += '</li>';
    }

    return htmlBuilder;
}

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
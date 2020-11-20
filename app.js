//require module
const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
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


//render view
app.get("/", (req, res) => {
    res.render("home");
})

//run server in port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//require module
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
//create app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use module
app.use(express.static('public'));
app.use(express.static('config'));
app.use(express.static('resources'));

//set nescessary
app.set("views", "./views");

require('./middlewares/view.mdw')(app);
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);
require('./middlewares/error.mdw')(app);

//run server in port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
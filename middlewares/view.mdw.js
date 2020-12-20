const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function(app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/layouts',
        helpers: {
            section: hbs_sections(),
            format(val) {
                return numeral(val).format('0,0');
            }
        }
    }));
    app.set('view engine', 'hbs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    var hbs = exphbs.create({});
    hbs.handlebars.registerHelper('loop', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});
}
module.exports = function(app) {

    app.use('/', require('../routes/index.route'));

    app.use('/search', require('../routes/search.route'));


};
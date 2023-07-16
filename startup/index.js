const { connectDB } = require('./connectDB');
const indexRouter = require('./router');

exports.startup = async (app) => {
    await connectDB()
    app.use('/', indexRouter);
    app.use((req, res) => res.render('notfound'));
}
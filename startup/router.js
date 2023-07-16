const router = require('express').Router();
const indexRouter = require('../routes/index');

router.use('/', indexRouter);

module.exports = router;
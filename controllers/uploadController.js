const uploadPostController = (req, res, next) => {
  res.send('ok')
}
const uploadController = (req, res, next) => {
  res.render('pages/upload/upload')
}
const uploadCmtPostController = (req, res, next) => {
  res.send('ok')
}
module.exports = {
  uploadController, uploadPostController, uploadCmtPostController
}

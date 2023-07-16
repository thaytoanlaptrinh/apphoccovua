const homeController = (req, res) => {
  if (req.session.userId) {
    return res.render('pages/home/home')
  }
  res.redirect('/login');
}

module.exports = {
  homeController
}

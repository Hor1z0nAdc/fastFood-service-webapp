function admin (req, res, next) {
  if(req.isAuthenticated() && req.user.beosztás === "admin" ) {
      return next()
  }
  return res.redirect('/')
}

module.exports = admin
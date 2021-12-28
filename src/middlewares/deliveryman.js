function deliveryman (req, res, next) {
    if(req.isAuthenticated() && req.user.beosztás === "futár") {
        return next()
    }
    return res.redirect('/bejelentkezes')
  }
  
  module.exports = deliveryman
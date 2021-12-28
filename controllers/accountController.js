const Felhasználó = require("../models/felhasználó")
const passport = require("passport")
const bcrypt = require("bcrypt")

const getRegister = (req,res) => {
  res.render("sites/regisztracio")
}

const getLogin = (req,res) => {
  res.render("sites/bejelentkezes")
}

const postRegister = async (req,res) =>{
  const {name, email, password1, password2} = req.body

  //Név ellenőrzés
  if(!name) {
    req.flash("nameError", "Meg kell adnia a felhasználónevét!")
    req.flash("email", email)
    return res.redirect("/regisztracio")
  }
  else if (name.length < 3 || name.length > 13) {
    req.flash("nameError", "A felhasználónévnek 3-16 karakter hosszúnak kell lennie.")
    req.flash("email", email)
    return res.redirect("/regisztracio")
  }

  //Email ellenőrzés
  if(!email) {
    req.flash("emailError", "Meg kell adnia az email címét!")
    req.flash("név", name)
    return res.redirect("/regisztracio")
  }

  //Jelszó ellenőrzés
  if(!password1){
    req.flash("passwordError", "Meg kell adnia a jelszavát!")
    req.flash("email", email)
    req.flash("név", name)
    return res.redirect("/regisztracio")
  }
  else if( password1.length < 5 ||  password1.length > 16){
    req.flash("passwordError", "A jelszónak 5-16 karakter hosszúnak kell lennie.")
    req.flash("email", email)
    req.flash("név", name)
    return res.redirect("/regisztracio")
  }
  if(password1!== password2) {
    req.flash("password2Error", "A két jelszó nem egyezik!")
    req.flash("email", email)
    req.flash("név", name)
    return res.redirect("/regisztracio")
  }

  //Foglalt email ellenőrzés
  const isExist = await Felhasználó.exists({email})
  if(isExist) {
    req.flash("emailError", "A megadott email már foglalt!")
    req.flash("név", name)
    return res.redirect("/regisztracio")
  } 

  //Ha minden jó, felhasználó objektum létrehozás
  const hashedPassword = await bcrypt.hash(password1, 12)
  const felhasználó = new Felhasználó({
    név: name,
    email,
    jelszó: hashedPassword
  })

  //Felhasználó mentés adatbázisba
  felhasználó.save().then( () =>{
    return res.redirect("/")
  })
  .catch(err => {
    req.flash("error","Hiba történt.")
    console.log(err)
    return res.redirect("/regisztracio")
  })
}

const postLogin = (req, res ,next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) {
      req.flash("error", info.message)
      console.log(err)
      return next(err)
    }

    if(!user) {
      req.flash("email", info.email)
      req.flash("error", info.message)
      return res.redirect("/bejelentkezes")
    }

    req.login(user, err => {
      if(err) {
        req.flash("error", info.message)
        return next(err)
      }

      if(user.beosztás == "futár") return res.redirect("/futar")
      return res.redirect("/")
    })
  })(req, res, next)
}

const logout = (req,res) => {
  req.logout()
  return res.redirect("/bejelentkezes")
}

module.exports = {
  getRegister,
  getLogin,
  postRegister,
  postLogin,
  logout
}
const Felhasználó = require("../models/felhasználó")
const passport = require("passport")
const bcrypt = require("bcrypt")
const accountF = require("../src/functions/accountFunctions.js")

const getRegister = (req,res) => {
  res.render("sites/regisztracio")
}

const getLogin = (req,res) => {
  res.render("sites/bejelentkezes")
}

const postRegister = async (req,res) =>{
  const {name, email, password1, password2} = req.body

  //Megadott paraméterek validációja
  const isInvalid = accountF.registerValidation(name, email, password1, password2, req)

  //Foglalt email ellenőrzés
  const isTaken = await Felhasználó.exists({email})
  if (isTaken) {
    accountF.takenEmail(name, req)
  } 
    
  
  if(isInvalid || isTaken) return res.redirect("/regisztracio")

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
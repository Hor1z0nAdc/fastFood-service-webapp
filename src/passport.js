const LocalStrategy = require('passport-local').Strategy
const Felhasználó = require('../models/felhasználó')
const bcrypt = require("bcrypt")

const customFields = {
  usernameField: "email",
  passwordField: "password"
}

const verifyCallback = async (username, password, done) => {
  //Email ellenőrzés, felhasználó megkeresése
  const user = await Felhasználó.findOne({email: username})
  if(!user) {
    return done(null,false, { message: "Nincs ilyen email regisztrálva."})
  }
 
  //Jelszó ellenőrzés
  bcrypt.compare(password, user.jelszó).then( match => {
    if(match) {
      return done(null, user, { message: "Sikeresen bejelentkezett."})
    }
    //Helytelen jelszó
    return done(null, false, { message: "Helytelen jelszó.", email: username })
    }).catch(err => {
      console.log(err)
      return done(null, false, { message: "Hiba történt."})
    })
  }

function init(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, verifyCallback))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    Felhasználó.findById(id, (err, user) => {
        done(err, user)
    })
  })
}

module.exports = {init}
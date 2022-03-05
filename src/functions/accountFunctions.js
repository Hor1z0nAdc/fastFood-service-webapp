const Felhasználó = require("../../models/felhasználó.js")

function registerValidation(name, email, password1, password2, req) {
    let isError = false

    if(!name) {
        req.flash("nameError", "Meg kell adnia a felhasználónevét!")
        req.flash("email", email)
        isError = true
    }
    else if (name.length < 3 || name.length > 13) {
      req.flash("nameError", "A felhasználónévnek 3-16 karakter hosszúnak kell lennie.")
      req.flash("email", email)
      isError = true
    }
    
    //Email ellenőrzés
    if(!email) {
      req.flash("emailError", "Meg kell adnia az email címét!")
      req.flash("név", name)
      isError = true
    }
  
    //Jelszó ellenőrzés
    if(!password1){
      req.flash("passwordError", "Meg kell adnia a jelszavát!")
      req.flash("email", email)
      req.flash("név", name)
      isError = true
    }
    else if( password1.length < 5 ||  password1.length > 16){
      req.flash("passwordError", "A jelszónak 5-16 karakter hosszúnak kell lennie.")
      req.flash("email", email)
      req.flash("név", name)
      isError = true
    }
    if(password1!== password2) {
      req.flash("password2Error", "A két jelszó nem egyezik!")
      req.flash("email", email)
      req.flash("név", name)
      isError = true
    }

    return isError
}

function takenEmail(name, req) {
    req.flash("emailError", "A megadott email már foglalt!")
    req.flash("név", name)
}

module.exports = { registerValidation, takenEmail }
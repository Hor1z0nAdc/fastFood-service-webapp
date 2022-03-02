const felhasználó = require("../models/felhasználó")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { google } = require("googleapis")

const CLIENT_ID = "1044933745510-rk0ptd503otlf4f34p7oq1rv01s5503b.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URL = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04F6U3nOnhyQKCgYIARAAGAQSNwF-L9IryG9Y-IjnfZnmJyy6LPh_Jb0UUOtqScJePRMMkdTJznCpZk6Qy9i7rHdBnrM7Z_pel1s"
const jwt_secret = "secret"

const oAuth2Client = new google.auth.OAuth2( CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(email, link) {
  try{
    const accesToken = await oAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "kristoflaszlo50@gmail.com", 
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accesToken
      },
    });

    const mailOptions =  {
      from: '"Hamizó" <kristoflaszlo50@gmail.com>',
      to: `${email}`, 
      subject: "Password reset", 
      text: `A jelszó megváltoztatásához kattintson az alábbi linkre: ${link}`
    }

    const result = await transporter.sendMail(mailOptions)
    return result
  } 
  catch (error) {
    console.log("Hiiiba: " + error.message)
    return error
  }
}

const getReset = (req,res) => {
  res.render("sites/password/passwordReset")
} 

const postReset = async (req,res) => {
  const { email } = req.body
  const user = await felhasználó.findOne({email})

  if(!user) {
      req.flash("error", "A megadott email nincs regisztrálva!")
      return res.redirect("/elfelejtett_jelszo")
  }
  
  const payload = {
    id: user._id,
    email: user.email
  }

  const secret = jwt_secret + user.password
  const token = jwt.sign(payload, secret, {expiresIn: "15m"})
  const link = `http://localhost:3000/reset_jelszo/${user._id}/${token}`
  console.log(link)

  sendMail(user.email, link).then(result => {
    console.log("Email has been sent.")
    req.flash("success", "Elküldtük a linket a megadott címre.")
  }).catch(error => {
    req.flash("error", "Szerver hiba. Próbálja meg később!")
    console.log("Hiba: " + error.message)
  }) 
  res.redirect("/elfelejtett_jelszo")
} 

const getNewPassword = async (req,res) => {
  const { id, token } = req.params
  const user = await felhasználó.findOne({ _id: id })

  if(!user) {
    req.flash("error","Hiba! Ilyen felhasználó nem létezik.")
    return res.redirect("/elfelejtett_jelszo")
  }
  else if(user.id != id) {
    req.flash("error", "Hiba! Nem megfelelő id.")
    return res.redirect("/elfelejtett_jelszo")
  }

  const secret = jwt_secret + user.password
  try {
    const payload = jwt.verify(token, secret)
    const url = `/reset_jelszo/${id}/${token}`
    res.render("sites/password/newPassword", { email: user.email, url })
  }
  catch (error) {
    console.log(error)
    req.flash("error", "Nem megfelelő paraméterek")
    return res.redirect("/elfelejtett_jelszo")
  }

  //res.render("sites/password/newPassword")
} 

const postNewPassword = async (req,res) => {
  const { id, token } = req.params
  const { password1, password2 } = req.body
  const user = await felhasználó.findOne({ _id: id })

  if(!user) {
    req.flash("error","Hiba! Ilyen felhasználó nem létezik.")
    return res.redirect("/elfelejtett_jelszo")
  }
  else if(user.id != id) {
    req.flash("error", "Hiba! Nem megfelelő id.")
    return res.redirect("/elfelejtett_jelszo")
  }

  const secret = jwt_secret + user.password
  try {
    const payload = jwt.verify(token, secret)

    if(password1.length < 5 ||  password1.length > 16) {
      req.flash("password", "Az új jelszónak 5-16 karakter között kell lennie")
      return res.redirect(`/reset_jelszo/${id}/${token}`)
    }
    else if(password1 !== password2) {
      req.flash("password", "A megadott jelszavak nem egyeznek.")
      return res.redirect(`/reset_jelszo/${id}/${token}`)
    }
    const hashedPassword = await bcrypt.hash(password1, 12)
    const respone = await felhasználó.updateOne(
      {
        _id: id
      },
      {
        $set: {
          jelszó: hashedPassword
        }
      })
    return res.redirect("/")
  } 
  catch (error) {
    console.log(error)
    req.flash("error", "Nem megfelelő paraméterek")
    return res.redirect("/elfelejtett_jelszo")
  }
} 

module.exports = {
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
}


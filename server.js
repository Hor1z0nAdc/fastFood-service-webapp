require("dotenv").config()
const express = require("express")
const flash = require("express-flash")
const path = require("path")
const ejs = require("ejs")
const expressLayouts = require('express-ejs-layouts');
const passport = require("passport")
const mongoose = require("mongoose")
const session = require("express-session")
const mongoDbStore = require("connect-mongo")
const passportInit = require("./src/passport")
const mainRoute = require("./routes/mainRoute")
const Emitter = require("events")
const multer = require("multer")
const { urlencoded } = require("express")
const app = express()
const connectionString = "mongodb+srv://Hor1z0n:Hor1z0n981217@gyorsetterem.cjrgz.mongodb.net/gyorsetterem?retryWrites=true&w=majority"
const PORT = process.env.PORT || 3000

//Emitter
const eventEmitter = new Emitter()
app.set("eventEmitter", eventEmitter)

//Multer config for storing images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images")
  },

  filename: (req,file, callback) => {
      callback(null, file.originalname + Date.now())
  }
})

const uploadImage = multer({ storage })

//Session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoDbStore.create({
  mongoUrl: connectionString,
  collectionName: "sessions"
}),
  cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

//Passport config
passportInit.init(passport)
app.use(passport.initialize())
app.use(passport.session())

//Middleware
app.use((req,res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//views
app.use(expressLayouts)
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())
app.use(urlencoded({extended: false}))
app.use(flash())
app.use(express.static('public'))
app.use("/vasarlo", express.static('public'))
app.use("/admin", express.static('public'))
app.use("/vasarlo/rendelesek", express.static('public'))
app.use("/reset_jelszo/:id", express.static('public'))
app.use("/change-item/:id", express.static('public'))
app.use("/upload-item", express.static('public'))
app.use("/futarok", express.static('public'))
app.use("/futar", express.static('public'))

//Route
app.use(mainRoute)

//Database
//local connection - mongodb://localhost:27017/gyorsétterem
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if(!err) {console.log("Connected to database")}
    else {console.log(`Error:${err}`)}
})

//Startig server
const server = app.listen(PORT, () =>{ console.log(`running on port ${PORT}`)} )

//Socket 
const io = require("socket.io")(server)
io.on("connection", socket => {

  socket.on("join", roomName => {
    socket.join(roomName)
  }) 
})

eventEmitter.on("orderUpdated", data => {
  io.to(`order_${data._id}`).emit("orderUpdated", data)
})

eventEmitter.on("orderPlaced", data => {
  io.to("adminRoom").emit("orderPlaced", data)
})
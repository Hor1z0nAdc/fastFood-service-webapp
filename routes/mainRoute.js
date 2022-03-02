const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const bcrypt = require("bcrypt")
const Termék = require("../models/termék")
const path = require("path")
const Felhasználó = require("../models/felhasználó")
const itemController = require("../controllers/itemController")
const accountController = require("../controllers/accountController")
const cartController = require("../controllers/cartController")
const resetController = require("../controllers/resetController")
const orderController = require("../controllers/customer/orderController")
const adminController = require("../controllers/admin/orderController")
const statusController = require("../controllers/admin/statusController")
const itemActionController = require("../controllers/admin/itemActionController")
const deliveryController = require("../controllers/admin/deliveryController")
const deliverymanController = require("../controllers/delivery/deliverymanController")
const router = express.Router()

//Middleware
const guest = require("../src/middlewares/guest")
const auth = require("../src/middlewares/auth")
const admin = require("../src/middlewares/admin")
const deliveryman = require("../src/middlewares/deliveryman")
const date = require("../src/middlewares/date")


//Multer 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "public/images")
    },
   
    filename: (req,file, callback) => {
        let currentDate = date.currentDate()
        currentDate = currentDate.replace(/\//g,"");
        const savedFileName = path.parse(file.originalname).name  + currentDate + path.parse(file.originalname).ext
        callback(null, savedFileName)
    }
})
const uploadImage = multer({ storage })
  
//Termékek
router.get("/", itemController.index)
router.get("/pizza", itemController.getPizza)
router.get("/hamburger", itemController.getHamburger)
router.get("/palacsinta", itemController.getPalacsisnta)
router.get("/udito", itemController.getÜdítő)

//Kosár
router.get("/cart", cartController.getCart)
router.get("/cart/update/:product", cartController.updateProduct)
router.post("/update-cart", cartController.updateCart)

//bejelentkezés és regisztráció
router.get("/bejelentkezes", guest, accountController.getLogin)
router.post("/bejelentkezes", accountController.postLogin)
router.get("/regisztracio", guest, accountController.getRegister)
router.post("/regisztracio", accountController.postRegister)
router.get("/logout", accountController.logout)
router.get("/elfelejtett_jelszo", guest,  resetController.getReset)
router.post("/elfelejtett_jelszo", guest, resetController.postReset)
router.get("/reset_jelszo/:id/:token", resetController.getNewPassword)
router.post("/reset_jelszo/:id/:token", resetController.postNewPassword)

//Vásárló
router.post("/vasarlo/rendeles", auth, orderController.rendelés)
router.get("/vasarlo/rendelesek", auth, orderController.index)
router.get("/vasarlo/rendelesek/:id", auth, orderController.show)
router.get("/vasarlo/rendelesek/delete", auth, orderController.deleteClosedOrder)

//Admin
router.get("/admin/rendelesek", admin, adminController.index)
router.get("/admin/rendelesek/delete", admin, adminController.deleteClosedOrder)
router.post("/admin/rendeles/allapot", admin, statusController.update)

router.post("/delete-item", admin, itemActionController.deleteItem)
router.get("/change-item/:id", admin, itemActionController.getChangeItem )
router.get("/upload-item", admin, itemActionController.getUploadItem )
router.post("/upload-item", admin, uploadImage.single("image"), itemActionController.postUploadItem)
router.post("/change-item", admin, uploadImage.single("image"), itemActionController.postChangeItem)

router.get("/futarok", admin, deliveryController.delivery)
router.post("/futarok/delete", admin, deliveryController.deleteDelivery)
router.get("/futarok/register", admin, deliveryController.getRegister)
router.post("/futarok/register", admin, deliveryController.postRegister)
router.get("/futarok/kiosztas", admin, deliveryController.kiosztas)
router.post("/futarok/kiosztas", admin, deliveryController.postKiosztas)
router.get("/futarok/kiosztas/delete", admin, deliveryController.deleteKiosztas)

//Futár
router.get("/futar", deliveryman, deliverymanController.index)
router.get("/futar/map", deliveryman, deliverymanController.map)
router.post("/futar/map/delete", deliveryman, deliverymanController.deleteDropoff)

//404
router.use((req,res) => {
    res.status(404)
    res.sendFile(process.cwd() + "/views/404.html")
})

module.exports = router
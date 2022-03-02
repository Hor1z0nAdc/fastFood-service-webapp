const Rendelés = require("../../models/rendelés")
const dateFormat = require("dateformat")

const index = async (req,res) => {
  const rendelések = await Rendelés.find({vásárlóId: req.user._id}, null, {sort: { "createdAt": -1}})
  
  res.render("sites/customer/rendelesek", {rendelések, dateFormat})
}

const show = async (req,res) => {
  const rendelés = await Rendelés.findById(req.params.id)

  if(req.user._id.toString() === rendelés.vásárlóId.toString()) {
    let results = key(rendelés)

    return res.render("sites/customer/rendeles", {termékek: rendelés.termékek, 
                                                  keys: results.keys, 
                                                  rendelés, 
                                                  összeg: results.összeg
                                                 })
  }

  return res.redirect("/")
}

const deleteClosedOrder = async (req,res) => {
  
  
  res.redirect("/vasarlo/rendelesek")
}

const rendelés = (req,res) => {
  const { telefonszám, cím, coords1, coords2 } = req.body

  let coordsArray = []
  coordsArray[0] = coords1
  coordsArray[1] = coords2
  console.log(coordsArray)

  if(!telefonszám || !cím) {
    req.flash("error", "Az összes mezőt ki kell töltenie!")
    res.redirect("/cart")
  }

  const rendelés = new Rendelés({
    vásárlóId: req.user._id,
    termékek: req.session.cart.items,
    telefonszám,
    cím,
    koordináta: coordsArray
  })

  rendelés.save().then(result => {
    delete req.session.cart
    //Emit event
    const eventEmitter = req.app.get("eventEmitter")
    eventEmitter.emit("orderPlaced", result)

    req.flash("siker", "Sikeres rendelés")
    res.redirect("/vasarlo/rendelesek")
 }).catch(err => {
    console.log(err)
    req.flash("error", "Hiba történt.")
    res.redirect("/cart")
 })
}

function key(rendelés) {
  const keys = Object.keys(rendelés.termékek)
  let összeg = 0

  keys.forEach(key => {
    összeg += rendelés.termékek[key].item.ár *  rendelés.termékek[key].quantity
  });

  return { keys, összeg }
}

function saveRendelés(req, telefonszám, cím, coordsArray) {
  const rendelés = new Rendelés({
    vásárlóId: req.user._id,
    termékek: req.session.cart.items,
    telefonszám,
    cím,
    koordináta: coordsArray
  })
  rendelés.save()

  return new Promise((resolve, reject) => {
     if(true) {
       resolve("bro")
     }
     else {
       reject("nope")
     }
   })
}

module.exports = {
  rendelés,
  index,
  show,
  deleteClosedOrder,
  key,
  saveRendelés
}
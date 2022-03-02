const Rendelés = require("../../models/rendelés")

const update = (req,res) => {
  Rendelés.updateOne({_id: req.body.orderId}, { állapot: req.body.status}, (err, data) => {
    if(err) {
      console.log(err)
      return res.redirect("/admin/rendelesek")
    }
    //Sikeres frissítés után emit event
    const eventEmitter = req.app.get("eventEmitter")
    eventEmitter.emit("orderUpdated", { id: req.body.orderId, állapot: req.body.status })
    return res.redirect("/admin/rendelesek")
  })
}

module.exports = { update }
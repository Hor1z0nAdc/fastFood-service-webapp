const Rendelés = require("../../models/rendelés")
const dateFormat = require("dateformat")

const index = (req,res) => {
  Rendelés.find({állapot: { $ne: "kész"}}, null , { sort : { "createdAt": -1}}).populate("vásárlóId", "-password").exec((err, rendelések) => {
      res.render("sites/admin/rendelesek", { rendelések, dateFormat })
  })
}

const deleteClosedOrder = async (req,res) => {
  await Rendelés.findOneAndDelete({ _id: req.query.id })
  return res.redirect("/admin/rendelesek")
}

module.exports = { 
  index,
  deleteClosedOrder }
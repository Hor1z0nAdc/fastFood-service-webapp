const Termék = require("../models/termék")

const index = (req,res) => {
  if(req.user && req.user.beosztás == "futár") {
    res.redirect("/futar")
  }
  return res.render("sites/index")
} 

const getPizza = async (req,res) => {
  const pizza = await Termék.find({kategória: "pizza"})
  return res.render("sites/items/pizza", { pizza })
} 

const getHamburger = async (req,res) => {
  const hamburger = await Termék.find({kategória: "hamburger"})
  return res.render("sites/items/hamburger", { hamburger })
}

const getPalacsisnta = async (req,res) => {
  const palacsinta = await Termék.find({kategória: "palacsinta"})
  return res.render("sites/items/palacsinta", { palacsinta })
}

const getÜdítő = async (req,res) => {
  const üdítő = await Termék.find({kategória: "üdítő"})
  return res.render("sites/items/udito", { üdítő })
} 


module.exports = {
  index,
  getPizza,
  getHamburger,
  getPalacsisnta,
  getÜdítő
}
const Rendelés = require("../../models/rendelés")
const dateFormat = require("dateformat")

const index = (req,res) => {
  Rendelés.find({állapot: { $ne: "kész"}}, null , { sort : { "createdAt": -1 }}).populate("vásárlóId", "-password").exec((err, rendelések) => {
      let seperatedTermékek = seperateTermékek(rendelések)
      let termékek = formatTermékek(seperatedTermékek)
      
      for(let i = 0; i < rendelések.length; i++) {
       let rendelés = rendelések[i]
       rendelés["formated"] = termékek[i]
      }
    
      res.render("sites/admin/rendelesek", { rendelések, dateFormat})
  })
}

const deleteClosedOrder = async (req,res) => {
  await Rendelés.findOneAndDelete({ _id: req.query.id })
  return res.redirect("/admin/rendelesek")
}

function seperateTermékek(rendelések) {
  let rendelésArray = []
  let seperatedItems = []

  //save the items and it's keys to seperate arrays
  rendelések.forEach(rendelés => {
    rendelésArray.push(rendelés.termékek)
  });

  rendelésArray.forEach(rendelés => {
    let items = []

    let value1 = Object.values(rendelés)
    value1.forEach(value => {
      let value2 = Object.values(value)

      let quantity = value2[1]
      let name = value2[0].név
      let obj = { name, quantity }
      items.push(obj)
    })

    seperatedItems.push(items)
  })
  //console.log(seperatedItems)
  return seperatedItems
}

function formatTermékek(seperatedItems) {
  let formatedArray = []

  for(let i = 0; i < seperatedItems.length; i++) {
    let string = ''

    for(let j = 0; j < seperatedItems[i].length; j++) {
      let item = seperatedItems[i][j]
      string = string + `${item.name} ${item.quantity} db\n`
    }
    formatedArray.push(string)
  }

  return formatedArray
}

module.exports = 
{ 
  index,
  deleteClosedOrder,
  seperateTermékek,
  formatTermékek
}